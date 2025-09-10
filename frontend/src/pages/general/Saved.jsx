import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import '../../styles/home.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const Saved = () => {
    const [ videos, setVideos ] = useState([])
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/api/auth/me", { withCredentials: true })
            .then(response => {
                setUser(response.data.user || response.data.foodPartner);
            })
            .catch(() => {
                setUser(null);
            });

        axios.get("http://localhost:3000/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                }))
                setVideos(savedFoods)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.filter((v) => v._id !== item._id))
        } catch {
            // noop
        }
    }

    return (
        <>
            {user ? (
                <ReelFeed
                    items={videos}
                    onSave={removeSaved}
                    emptyMessage="No saved videos yet."
                />
            ) : (
                <div className="saved-background-image">
                    <div className="welcome-message">
                        If you want to see your saved videos, please login first.
                    </div>
                </div>
            )}
        </>
    )
}

export default Saved