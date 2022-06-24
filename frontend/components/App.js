import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import PrivateRoute from './PrivateRoute'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

const initialArticleShape = null

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const [ currentArticle, setCurrentArticle ] = useState(initialArticleShape)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ 
    navigate("/")
  }
  const redirectToArticles = () => { /* ✨ implement */ 
    navigate("articles")
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token");
    setMessage("Goodbye!")
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, {username: username, password: password})
      .then(res => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
      })
      .catch(err => console.error(err))
      .finally(setSpinnerOn(false));
    
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    axiosWithAuth().get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch(err => logout())
      .finally(setSpinnerOn(false));
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axiosWithAuth().post(articlesUrl, article)
      .then(res => {
        setMessage(res.data.message);
        setArticles([...articles, res.data.article])
      })
      .catch(err => console.error(err))
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!

    axiosWithAuth().put(`${articlesUrl}/${article_id}`, article)
      .then(res => {
        setMessage(res.data.message);
        const filterArt = articles.filter(ar => ar.article_id !== article_id)
        setArticles([...filterArt, res.data.article])
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        setMessage(res.data.message);
        const filtered = articles.filter(ar => ar.article_id !== article_id);
        setArticles([...filtered]);
    })
      .catch(err => console.error(err))
  }


  useEffect(() => {
    if(!currentArticleId) return setCurrentArticle(null);
      const findArt = articles.find(ar => {
      return ar.article_id === currentArticleId
    })
    setCurrentArticle(findArt)
  }, [currentArticleId])

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <PrivateRoute>

              <ArticleForm 
                articles={articles} 
                setCurrentArticleId={setCurrentArticleId} 
                currentArticle={currentArticle} 
                postArticle={postArticle} 
                updateArticle={updateArticle} 
                />

              <Articles 
                getArticles={getArticles} 
                articles={articles} 
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}
                />

            </PrivateRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
