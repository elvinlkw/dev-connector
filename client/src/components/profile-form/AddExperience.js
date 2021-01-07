import React, { Fragment, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addExperience } from '../../actions/profile';

const AddExperience = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const [toDateDisabled, setToggleDisabled] = useState(false);

  const { company, title, location, from, to, current, description } = formData;

  const handleChange = e => setFormData({ ...formData, [e.target.name] : e.target.value });

  return (
    <Fragment>
      <h1 class="large text-primary">
        Add An Experience
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={e => {
        e.preventDefault();
        dispatch(addExperience(formData, history));

      }}>
        <div class="form-group">
          <input type="text" placeholder="* Job Title" name="title" value={title} onChange={handleChange} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="* Company" name="company" value={company} onChange={handleChange} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={handleChange} />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={handleChange} />
        </div>
        <div class="form-group">
          <p><input type="checkbox" name="current" value={current} onChange={e => {
            setFormData({ ...formData, current: !current});
            setToggleDisabled(!toDateDisabled)
          }} />{' '}Current Job</p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={handleChange} disabled={toDateDisabled ? 'disabled' : ''} />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
            value={description}
            onChange={handleChange}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <Link class="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </Fragment>
  )
}

export default AddExperience;