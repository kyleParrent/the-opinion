import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class ReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      informButt: 'inform m-2 ms-0',
      perButt: 'persuade m-2',
      currentRating: null,
      currentReview: null,
      error: false
    };
    this.handleClickInform = this.handleClickInform.bind(this);
    this.handleClickPersuade = this.handleClickPersuade.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickOk = this.handleClickOk.bind(this);
  }

  handleClickOk() {
    this.setState({ error: false });
  }

  handleClickInform(event) {
    this.setState({ informButt: 'inform-on m-2 ms-0', perButt: 'persuade-off m-2', currentRating: 'inform' });
  }

  handleClickPersuade(event) {
    this.setState({ informButt: 'inform-off m-2 ms-0', perButt: 'persuade-on m-2', currentRating: 'persuade' });
  }

  handleChange(event) {
    this.setState({ currentReview: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.currentRating === null) {
      this.setState({ error: true });
      return;
    }
    const { user } = this.context;
    const theToken = window.localStorage.getItem('app-jwt');
    fetch(`/api/article-info?title=${this.props.info.title}&publishedAt=${this.props.info.publishedAt}`)
      .then(res => res.json())
      .then(result => {
        if (!result.articleId) {
          const req = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Token': theToken
            },
            body: JSON.stringify({ articleInfo: this.props.info })
          };
          fetch('/api/article-review', req)
            .then(res => res.json())
            .then(result => {
              const newArticleId = parseInt(result.articleId);
              const req = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Access-Token': theToken
                },
                body: JSON.stringify(this.state)
              };
              fetch(`/api/user-review?articleId=${newArticleId}`, req)
                .then(res => res.json())
                .then(result => {
                  window.location.hash = `#user-reviews?userId=${user.userId}`;
                });
            });
        } else {
          const articleId = parseInt(result.articleId);
          const req = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Token': theToken
            },
            body: JSON.stringify(this.state)
          };
          fetch(`/api/user-review?articleId=${articleId}`, req)
            .then(res => res.json())
            .then(result => {
              window.location.hash = `#user-reviews?userId=${user.userId}`;
            });
        }
      });
  }

  render() {
    const { user } = this.context;
    if (!user) return <Redirect to="sign-in" />;
    if (this.state.error === true) {
      return (
        <div className='d-flex justify-content-center'>
          <div className='review-container'>
            <div className='d-flex justify-content-center'>
              <h1>Your Opinion:</h1>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <h5 className='labels mt-4'>What type of article is this?</h5>
                <div className='d-flex'>
                  <button type='button' onClick={this.handleClickInform} className={this.state.informButt}>Informative</button>
                  <button type='button' onClick={this.handleClickPersuade} className={this.state.perButt}>Persuasive</button>
                </div>
                <label htmlFor="reviewComment" className="form-label labels">Review / Reasoning</label>
                <textarea className="form-control" id="reviewComment" rows="20" onChange={this.handleChange} required></textarea>
                <div className='d-flex justify-content-end'>
                  <button className='btn btn-dark m-3 me-0' type='submit'>SUBMIT</button>
                </div>
              </div>
              <div className='overlay d-flex justify-content-center align-items-center'>
                <div className='problem'>
                  <div className='d-flex justify-content-center mt-4'>
                    <h3 className='no-data'>You need to select an article type</h3>
                  </div>
                  <div className='d-flex justify-content-center mt-3'>
                    <button type='button' onClick={this.handleClickOk} className='btn btn-light'>OK</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className='d-flex justify-content-center'>
          <div className='review-container'>
            <div className='d-flex justify-content-center mt-3'>
              <h1>Your Opinion:</h1>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <h5 className='labels mt-4'>What type of article is this?</h5>
                <div className='d-flex'>
                  <button type='button' onClick={this.handleClickInform} className={this.state.informButt}>Informative</button>
                  <button type='button' onClick={this.handleClickPersuade} className={this.state.perButt}>Persuasive</button>
                </div>
                <label htmlFor="reviewComment" className="form-label labels">Review / Reasoning</label>
                <textarea className="form-control" id="reviewComment" rows="20" onChange={this.handleChange} required></textarea>
                <div className='d-flex justify-content-end'>
                  <button className='btn btn-dark m-3 me-0' type='submit'>SUBMIT</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }

}

ReviewForm.contextType = AppContext;
