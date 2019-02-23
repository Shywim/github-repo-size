// ==UserScript==
// @name GitHub Repository Size
// @namespace matthieuharle.com
// @match *://github.com/*
// @grant GM_getValue
// @grant GM_setValue
// @description Add repository size to their GitHub homepage
// @icon https://raw.githubusercontent.com/Shywim/github-repo-size/master/icon/48.png
// @homepageURL https://github.com/Shywim/github-repo-size
// @supportURL https://github.com/Shywim/github-repo-size/issues
// @author Matthieu Harlé
// @copyright 2017, Matthieu Harlé (https://matthieuharle.com)
// @license MIT; https://github.com/Shywim/github-repo-size/blob/master/LICENSE.md
// @version 1.2.0
// ==/UserScript==

/* global GM_getValue, GM_setValue */

const getStoredSetting = (key) => {
  return Promise.resolve(GM_getValue(key))
}

const setSetting = (key, value) => {
  GM_setValue(key, value)
}