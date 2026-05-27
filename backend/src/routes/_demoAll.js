const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Student, Teacher, Fee } = require('../models');
const { default: mongoose } = require('mongoose');

// NOTE: not used directly, kept for future module expansion.

module.exports = express.Router();

