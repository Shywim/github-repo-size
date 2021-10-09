# A Firefox addon to display a Github repository's size

[![Mozilla Add-on](https://img.shields.io/amo/v/github-repo-size.svg?style=flat-square)][amo]

Add repository size to the Github's summary.

![Addon screenshot](art/screenshot.png)

**⚠ This addon use the size as returned by the GitHub API and may be
innacurate due to how GitHub stores git repositories! See [here][soq] and
[here][ghb] for more informations.**

## Usage

Download the addon from **[addons.mozilla.org][amo]** or, if you prefer, you
can download this project as a userscript from the **[GitHub releases page][ghreleases]**.

### Private Repositories

A **Personal Access Token** from an account with access to the private repository is
required for this addon to work. You can create a Personal Access Token
[here][ghsettings]. **Don't forget to check the `repo` scope.**

You can also show the dialog to save your token by clicking on the element added
by the addon on any repository, public or private, or you can visit the addon's
settings page.

## Building

- Use `yarn build` to build the Firefox webextension
- Use `yarn watch` to have an automated build on changes and `yarn webext:run` to test the addon

[amo]: https://addons.mozilla.org/firefox/addon/github-repo-size/
[ujs]: https://github.com/Shywim/github-repo-size/releases/latest/download/github-repo-size.user.js
[ghreleases]: https://github.com/Shywim/github-repo-size/releases
[soq]: https://stackoverflow.com/a/8679592/1424030
[ghb]: https://git-blame.blogspot.fr/2012/08/bringing-bit-more-sanity-to-alternates.html
[ghsettings]: https://github.com/settings/tokens
