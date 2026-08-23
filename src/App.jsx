import { usePosts } from './postcontext.jsx';

function App() {
  const { posts, loading } = usePosts();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Community Hub Feed</h1>
      
      {loading ? (
        <p>Loading posts from backend...</p>
      ) : posts.length === 0 ? (
        <p>No posts found. Connect your backend server to load live posts!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id || post._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;