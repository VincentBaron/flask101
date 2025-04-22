from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    profile_pic_url = db.Column(db.String(255))
    
    # Relationships
    sets = db.relationship('Set', backref='user', lazy=True)
    likes = db.relationship('Like', backref='user', lazy=True)

class Set(db.Model):
    __tablename__ = 'sets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255))
    dummy = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Track(db.Model):
    __tablename__ = 'tracks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255), nullable=False)
    uri = db.Column(db.String(255), nullable=False)
    img_url = db.Column(db.String(255))

    # Many-to-many relationship with Set
    sets = db.relationship('Set', secondary='set_tracks', backref=db.backref('tracks', lazy=True))
    # One-to-many relationship with Like
    likes = db.relationship('Like', backref='track', lazy=True)

class Like(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Join table for Set and Track
set_tracks = db.Table('set_tracks',
    db.Column('set_id', db.Integer, db.ForeignKey('sets.id'), primary_key=True),
    db.Column('track_id', db.Integer, db.ForeignKey('tracks.id'), primary_key=True)
)

class Genre(db.Model):
    __tablename__ = 'genres'
    
    name = db.Column(db.String(255), primary_key=True)
    
    # Many-to-many relationship with User
    users = db.relationship('User', secondary='user_genres', backref=db.backref('genres', lazy=True))

# Join table for User and Genre
user_genres = db.Table('user_genres',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('genre_name', db.String(255), db.ForeignKey('genres.name'), primary_key=True)
) 