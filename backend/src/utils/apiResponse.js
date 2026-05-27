function ok(res, data) {
    return res.json({ success: true, ...data });
}

function fail(res, status, message) {
    return res.status(status).json({ success: false, message });
}

module.exports = { ok, fail };

