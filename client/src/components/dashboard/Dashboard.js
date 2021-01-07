import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import { deleteAccount } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const profileState = useSelector(state => state.profile);

  const { user } = auth;
  const { loading, profile } = profileState;

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  return loading && profile === null ? 
  <Spinner /> :
  <Fragment>
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
      <i className="fas fa-user"></i> Welcome { user && user.name }
    </p>
    {profile !== null ? 
    <Fragment>
      <DashboardActions />
      <Experience experience={profile.experience} />
      <Education education={profile.education} />
    </Fragment> : 
    <Fragment>
      <p>You have not yet setup a profile, please add some info</p>
      <Link to="/create-profile" className="btn btn-primary my-1">
        Create Profile
      </Link>
    </Fragment>}
    <div className="my-2">
        <button className="btn btn-danger" onClick={() => dispatch(deleteAccount())}>
          <i className="fas fa-user-minus"></i> Delete My Account
        </button>
      </div>
  </Fragment>
}

export default Dashboard;