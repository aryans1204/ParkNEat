/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * validator module
 * @const
 */
const validator = require('validator')

/**
 * bcrypt module
 * @const
 */
const bcrypt = require('bcrypt')

/**
 * jsonwebtoken module
 * @const
 */
const jwt = require('jsonwebtoken')

/**
 * Currency module
 * @const
 */
const Currency = require('./currency')

/**
 * Investment module
 * @const
 */
const Investment = require('./investments')

/**
 * Expenditures module
 * @const
 */
const Expenditure = require('./expenditure')

/**
 * Income module
 * @const
 */
const Income = require('./income')

/**
 * userSchema schema
 * @tclass userSchema
 * @property {String} name
 * @property {String} email
 * @property {String} password
 * @property {Object} tokens
 * @property {} timestamps
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid.")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    /**
     * @memberof User
     * @property {String} token
     */
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps:true
})

/**
 * Investments virtual
 */
userSchema.virtual('investments', {
    ref: 'Investment',
    localField: '_id',
    foreignField: 'portfolio_owner'
})

/**
 * Currencies virtual
 */
userSchema.virtual('currencies', {
    ref: 'Currency',
    localField: '_id',
    foreignField: 'currency_owner'
})

/**
 * Expenditures virtual
 */
userSchema.virtual('expenditures', {
    ref: 'Expenditure',
    localField: '_id',
    foreignField: 'expenditure_owner'
})

/**
 * Income virtual
 */
userSchema.virtual('income', {
    ref: 'Income',
    localField: '_id',
    foreignField: 'income_owner'
})

/**
 * toJSON method for User
 */
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

/**
 * Generate JWT auth tokens for a user.
 */
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

/**
 * Find a user by email credentials.
 * @async
 * @param {String} email
 * @param {String} password
 */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Unable to login.')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error({error: "Either the password or email is incorrect."})
    }

    return user
}

/**
 * Encrypt password after changing password.
 */
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

/**
 * Delete user income records, expenditure records, investment records and currencies.
 */
userSchema.pre('remove', async function (next) {
    const user = this
    await Income.deleteMany({ income_owner: user._id })
    await Expenditure.deleteMany({ expenditure_owner: user._id })
    await Investment.deleteMany({ portfolio_owner: user._id })
    await Currency.deleteMany({ currency_owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

/**
 * User module
 * @module User
 */
module.exports = User