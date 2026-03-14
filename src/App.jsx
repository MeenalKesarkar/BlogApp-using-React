import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useWindowSize from './hooks/useWindowSize';

function App() {

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const navigate = useNavigate();
  const { width } = useWindowSize();

  // Load posts from localStorage
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts"));
    if (storedPosts) {
      setPosts(storedPosts);
    }
  }, []);

  // Save posts to localStorage
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // Search posts
  useEffect(() => {
    const filteredResults = posts.filter(post =>
      post.body.toLowerCase().includes(search.toLowerCase()) ||
      post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  // Add Post
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');

    const newPost = { id, title: postTitle, datetime, body: postBody };

    const allPosts = [...posts, newPost];
    setPosts(allPosts);

    setPostTitle('');
    setPostBody('');
    navigate('/');
  };

  // Edit Post
  const handleEdit = (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');

    const updatedPosts = posts.map(post =>
      post.id === id
        ? { ...post, title: editTitle, datetime, body: editBody }
        : post
    );

    setPosts(updatedPosts);
    setEditTitle('');
    setEditBody('');
    navigate('/');
  };

  // Delete Post
  const handleDelete = (id) => {
    const postsList = posts.filter(post => post.id !== id);
    setPosts(postsList);
    navigate('/');
  };

  return (
    <div className="App">

      <Header title="React JS Blog" width={width} />

      <Nav search={search} setSearch={setSearch} />

      <Routes>

        <Route path="/" element={
          <Home posts={searchResults} />
        } />

        <Route path="/post" element={
          <NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />
        } />

        <Route path="/edit/:id" element={
          <EditPost
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody}
          />
        } />

        <Route path="/post/:id" element={
          <PostPage posts={posts} handleDelete={handleDelete} />
        } />

        <Route path="/about" element={<About />} />

        <Route path="*" element={<Missing />} />

      </Routes>

      <Footer />

    </div>
  );
}

export default App;