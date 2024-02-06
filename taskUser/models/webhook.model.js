const mongoose = require("mongoose");


const webhookSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        toLowerCase: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\//.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },

},
{
    timestamps: true
});


module.exports = mongoose.model("Webhook", webhookSchema);