exports.TransactionStatus = {
    Succeeded: 0,
    Failed: -1,
    Initiated: -2,
    Unknown: -8
};

exports.TransactionTypes = {
    Charge: 1,
    Send: 2,
    Refund: 3
};

exports.UserAccountTypes = {
    Admin: "admin"
};

exports.ProductNames = {
    SmallEgg: 'small_egg',
    LargeEgg: 'large_egg',
    MediumEgg: 'medium_egg'
};

exports.RequestStatus = {
    Pending: 1,
    Delivered: 2
};