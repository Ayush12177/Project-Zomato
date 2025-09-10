import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/reels.css';
import '../../styles/home.css';
import ReelFeed from '../../components/ReelFeed';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setVideos(response.data.foodItems);
            })
            .catch(() => { /* noop: optionally handle error */ });

        axios.get("http://localhost:3000/api/auth/me", { withCredentials: true })
            .then(response => {
                setUser(response.data.user || response.data.foodPartner);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    async function likeVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, { withCredentials: true });

        if (response.data.like) {
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v));
        } else {
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v));
        }
    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true });

        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v));
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v));
        }
    }

    const handleLogout = async () => {
        await axios.get("http://localhost:3000/api/auth/user/logout", { withCredentials: true });
        setUser(null);
        window.location.reload();
    };

    return (
        <div className="home-container">
            {user && (
                <div className="auth-buttons">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
            {user ? (
                <ReelFeed
                    items={videos}
                    onLike={likeVideo}
                    onSave={saveVideo}
                    emptyMessage="No videos available."
                />
            ) : (
                <div className="home-background-image">
                    <div className="welcome-message">
                        If you want to watch videos, please login first.
                        <div className="auth-buttons">
                            <Link to="/user/register">Signup</Link>
                            <Link to="/user/login">Signin</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;