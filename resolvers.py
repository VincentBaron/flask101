from ariadne import ObjectType, QueryType, MutationType
from models import User, Set, Track, Genre, Like
from app import db

query = QueryType()
mutation = MutationType()
user = ObjectType("User")
set_type = ObjectType("Set")
track = ObjectType("Track")
genre = ObjectType("Genre")
like = ObjectType("Like")

# Query resolvers
@query.field("users")
def resolve_users(*_):
    return User.query.all()

@query.field("user")
def resolve_user(*_, id):
    return User.query.get(id)

@query.field("sets")
def resolve_sets(*_):
    return Set.query.all()

@query.field("set")
def resolve_set(*_, id):
    return Set.query.get(id)

@query.field("tracks")
def resolve_tracks(*_):
    return Track.query.all()

@query.field("track")
def resolve_track(*_, id):
    return Track.query.get(id)

@query.field("genres")
def resolve_genres(*_):
    return Genre.query.all()

@query.field("likes")
def resolve_likes(*_):
    return Like.query.all()

# Mutation resolvers
@mutation.field("createUser")
def resolve_create_user(*_, username, profilePicURL=None):
    user = User(
        username=username,
        profile_pic_url=profilePicURL
    )
    db.session.add(user)
    db.session.commit()
    return user

@mutation.field("createSet")
def resolve_create_set(*_, name, userId, link=None, dummy=False):
    set_obj = Set(
        name=name,
        link=link,
        dummy=dummy,
        user_id=userId
    )
    db.session.add(set_obj)
    db.session.commit()
    return set_obj

@mutation.field("addTrackToSet")
def resolve_add_track_to_set(*_, setId, trackId):
    set_obj = Set.query.get(setId)
    track_obj = Track.query.get(trackId)
    if set_obj and track_obj:
        set_obj.tracks.append(track_obj)
        db.session.commit()
    return set_obj

@mutation.field("removeTrackFromSet")
def resolve_remove_track_from_set(*_, setId, trackId):
    set_obj = Set.query.get(setId)
    track_obj = Track.query.get(trackId)
    if set_obj and track_obj and track_obj in set_obj.tracks:
        set_obj.tracks.remove(track_obj)
        db.session.commit()
    return set_obj

@mutation.field("addGenreToUser")
def resolve_add_genre_to_user(*_, userId, genreName):
    user = User.query.get(userId)
    genre = Genre.query.get(genreName)
    if not genre:
        genre = Genre(name=genreName)
        db.session.add(genre)
    if user and genre:
        user.genres.append(genre)
        db.session.commit()
    return user

@mutation.field("removeGenreFromUser")
def resolve_remove_genre_from_user(*_, userId, genreName):
    user = User.query.get(userId)
    genre = Genre.query.get(genreName)
    if user and genre and genre in user.genres:
        user.genres.remove(genre)
        db.session.commit()
    return user

@mutation.field("likeTrack")
def resolve_like_track(*_, userId, trackId):
    like = Like(user_id=userId, track_id=trackId)
    db.session.add(like)
    db.session.commit()
    return like

@mutation.field("unlikeTrack")
def resolve_unlike_track(*_, userId, trackId):
    like = Like.query.filter_by(user_id=userId, track_id=trackId).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        return True
    return False

# Type resolvers
@user.field("sets")
def resolve_user_sets(obj, *_):
    return Set.query.filter_by(user_id=obj.id).all()

@user.field("likes")
def resolve_user_likes(obj, *_):
    return Like.query.filter_by(user_id=obj.id).all()

@user.field("genres")
def resolve_user_genres(obj, *_):
    return obj.genres

@set_type.field("user")
def resolve_set_user(obj, *_):
    return User.query.get(obj.user_id)

@set_type.field("tracks")
def resolve_set_tracks(obj, *_):
    return obj.tracks

@track.field("sets")
def resolve_track_sets(obj, *_):
    return obj.sets

@track.field("likes")
def resolve_track_likes(obj, *_):
    return obj.likes

@genre.field("users")
def resolve_genre_users(obj, *_):
    return obj.users

@like.field("user")
def resolve_like_user(obj, *_):
    return User.query.get(obj.user_id)

@like.field("track")
def resolve_like_track(obj, *_):
    return Track.query.get(obj.track_id) 