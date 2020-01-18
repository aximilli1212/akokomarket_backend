module.exports = {

    /**
     * Generic events
     */
    generic : {
        create : "create_event",
        update: "update_event",
        remove: "delete_event"
    },

    /**
     * Market requests event
     */
    requests: {
        delivered: "delivered_event"
    },

    /**
     * Payment
     */
    payment:{
        paid: "payment_complete"
    }

};