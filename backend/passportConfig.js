const db = require('./db');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    // Local Strategy for authentication
    passport.use(
        new localStrategy((username, password, done) => {
            const query = "SELECT * FROM users where username = ?";
            db.query(query, [username], (err, rows) => {
                if(err) throw err;
                if(rows.length === 0) {
                    return done(null, false);
                }
                
                // WARNING: This is unsafe! Direct password comparison
                if(password === rows[0].password) {
                    return done(null, rows[0]);
                } else {
                    return done(null, false);
                }
            });
        })
    );

    // Serialize User (these should be outside the localStrategy)
    passport.serializeUser((user, done) => {  // Fixed: users -> user, serialze -> serializeUser
        done(null, user.id);
    });

    // Deserialize User (these should be outside the localStrategy)
    passport.deserializeUser((id, done) => {
        const query = "SELECT * FROM users where id = ?";  // Fixed: query now searches by id instead of username
        db.query(query, [id], (err, rows) => {
            if(err) throw err;
            if(rows.length === 0) {  // Added check for no user found
                return done(null, false);
            }
            const userInfo = {
                id: rows[0].id,
                username: rows[0].username
            };
            done(null, userInfo);
        });
    });
};