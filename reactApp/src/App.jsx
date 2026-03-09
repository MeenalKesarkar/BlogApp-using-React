import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "My Day",
      datetime: "March 16, 2026 11:11:11 AM",
      body: "It's my birthday."
    },
    {
      id: 2,
      title: "Party Time",
      datetime: "June 4, 2026 12:00:00 AM",
      body: "Let's party"
    },
    {
      id: 3,
      title: "Winter Again",
      datetime: "November 16, 2026 15:11:11 PM",
      body: "Ahhh! It's aleady winter"
    },
    {
       id: 4,
      title: "What a good day",
      datetime: "December 14, 2026 01:11:11 AM",
      body: "My Bestfriend's birthday"
    },
    {
       id: 5,
      title: "Hot summer",
      datetime: "Jan 15, 2027 16:11:00 PM",
      body: "Sunny Day"
    }
  ])
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const navigate = useNavigate();

  useEffect(() =>{
      const filteredResults = posts.filter(post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase())
    || ((post.title).toLowerCase()).includes(search.toLowerCase()))

    setSearchResults(filteredResults.reverse());
  },[posts, search])

  const handleSubmit = (e) =>{
      e.preventDefault();
      const id = posts.length ? posts[posts.length -1].id + 1 : 1;
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const newPost = { id, title: postTitle, datetime, body: postBody };
      const allPosts = [ ...posts, newPost ];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      history.pushState('/');

  }
  const handleDelete = (id) => {
    const postsList = posts.filter(post => post.id !== id);
    setPosts(postsList);
    navigate('/');
  }
  return (
    <div className="App">
      <Header title="React JS Blog"/>
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} />
        <Route path="/post" element={<NewPost 
          handleSubmit={handleSubmit} 
          postTitle={postTitle}
          setPostTitle={setPostTitle} 
          postBody={postBody}
          setPostBody={setPostBody}/>}
        />
        <Route path="/post/:id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App