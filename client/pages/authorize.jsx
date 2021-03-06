import React from 'react';
import AppContext from '../lib/app-context';
import AuthorizeForm from '../components/authorize-form';
import Redirect from '../components/redirect';

export default class AuthPage extends React.Component {
  render() {

    const { user, route, handleSignIn } = this.context;

    if (user) return <Redirect to="" />;

    const welcomeMessage = route.path === 'sign-in'
      ? 'Please sign in to continue'
      : 'Create an account!';
    const headerText = route.path === 'sign-up'
      ? 'Sign Up'
      : 'Sign In';
    return (
      <div className="row pt-5 align-items-center">
        <div className="col-12 offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-xl-4 offset-xl-4">
          <header className="text-center">
            <h2 className="mb-2">
              {
                headerText
              }
            </h2>
            <p className="text-muted mb-4">{welcomeMessage}</p>
          </header>
          <div className="border border-2 border-dark p-3 ">
            <AuthorizeForm
              key={route.path}
              action={route.path}
              onSignIn={handleSignIn} />
          </div>
        </div>
      </div>
    );
  }
}

AuthPage.contextType = AppContext;
