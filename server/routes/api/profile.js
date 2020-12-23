const express = require('express');
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get Current User's Profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update a user profile
// @access  Private
router.post('/', [
  auth, 
  [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ]
], 
async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // Build Profile Object
  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

  // Build Social Object
  profileFields.social = {};
  if(youtube) profileFields.social.youtube = youtube;
  if(facebook) profileFields.social.facebook = facebook;
  if(twitter) profileFields.social.twitter = twitter;
  if(instagram) profileFields.social.instagram = instagram;
  if(linkedin) profileFields.social.linkedin = linkedin;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    console.log(profile)

    if(profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields},
        { new: true }
      );

      return res.json(profile);
    }

    // CREATE
    profile = new Profile(profileFields);
    await profile.save();

    return res.json(profile);

  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    return res.json(profiles);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const profile = await Profile.findOne({ user: user_id }).populate("user", ["name", "avatar"]);

    if(!profile) {
      return res.status(404).json({ msg: "Profile Not Found" });
    }

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    if(error.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Profile Not Found" });
    }
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete Profile, User and Posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo users posts

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add Profile Experience
// @access  Private
router.put('/experience', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
  ]
], 
async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if(!profile) {
      return res.status(400).json({ msg: 'No profile found for this user' });
    }

    profile.experience.unshift(newExp);
    await profile.save();

    return res.json(profile);

  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from 
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  const exp_id = req.params.exp_id;

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience.map(exp => exp.id).indexOf(exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/education
// @desc    Add Profile Education
// @access  Private
router.put('/education', [
  auth,
  [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty(),
  ]
], async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if(!profile) {
      return res.status(400).json({ msg: "No Profile Found for this user" });
    }

    profile.education.unshift(newEdu);

    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  const edu_id = req.params.edu_id;

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education.map(edu => edu.id).indexOf(edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/github/:username
// @desc    Get user repos from Github
// @access  Private
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:desc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent' : 'node.js' }
    }

    request(options, (error, response, body) => {
      if(error) console.log(error);

      if(response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github Profile Found' });
      }

      return res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
});


module.exports = router;