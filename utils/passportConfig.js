// passportConfig.js
import passport from 'passport';
import {
    Strategy as LocalStrategy
} from 'passport-local';
import Customer from '../models/customer.model.js'; // Adjust the path as needed

export default function configurePassport() {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const customer = await Customer.findOne({
                email
            });
            if (!customer) {
                return done(null, false, {
                    message: 'Incorrect email.'
                });
            }
            const isMatch = customer.comparePassword(password);
            if (!isMatch) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, customer);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((customer, done) => {
        done(null, customer.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const customer = await Customer.findById(id);
            done(null, customer);
        } catch (error) {
            done(error);
        }
    });
}