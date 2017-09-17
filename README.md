A Firefox addon to display a Github repository's size
===

[![](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)
[![Mozilla Add-on](https://img.shields.io/amo/v/github-repo-size.svg?style=flat-square)][amo]
[![UserScript](https://img.shields.io/badge/userscript-v1.2.0-blue.svg?style=flat-square)][openjs]

Add repository size to the Github's summary.

![Addon screenshot](art/screenshot.png)

**⚠ This addon use the size as returned by the GitHub API and may be
innacurate due to how GitHub stores git repositories! See [here][soq] and
[here][ghb] for more informations.**

## Usage

Download the addon from **[addons.mozilla.org][amo]** or, if you prefer, you
can download this project as a userscript on **[OpenUserJs][openjs]** (also
available on the [GitHub releases page][ghreleases]).
*⚠ If you are using ViolentMonkey as a UserScript manager on Firefox, the
script will not work due to security constraints on Webextensions in Firefox,
see [violentmonkey/violentmonkey#173](https://github.com/violentmonkey/violentmonkey/issues/173).*

### Private Repositories

To enable this addon on private repositories, either go to a private
repository and a dialog will ask for a token automatically, or click on the
size on any public repository.
You can get a *Personnal Access Token* in your [GitHub settings][ghsettings].
Don't forget to check the `repo` scope.

## Building

 - Use `npm run build-webext` to build the Firefox webextension
 - Use `npm run build-userscript` to build the UserScript
 - Use `npm run webext` to have an automated build on changes

 [amo]: https://addons.mozilla.org/firefox/addon/github-repo-size/
 [openjs]: https://openuserjs.org/scripts/Shywim/GitHub_Repository_Size
 [ghreleases]: https://github.com/Shywim/github-repo-size/releases
 [soq]: https://stackoverflow.com/a/8679592/1424030
 [ghb]: https://git-blame.blogspot.fr/2012/08/bringing-bit-more-sanity-to-alternates.html
 [ghsettings]: https://github.com/settings/tokens
 
