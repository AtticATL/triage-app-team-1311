# TransferApp

Webapp to help transfer patients with odontogenic infections.

## Getting Started

To build the webapp, you need:

- [Node.js](https://nodejs.org/en/download/) version 16 (not 17)
- `yarn` (can be installed with `npm install --global yarn`)

Then, to run the webapp locally for testing:

```sh
# Install dependencies
$ yarn install

# Build the webapp into a dev environment
$ yarn dev
```


This will print out a url into your terminal leading to a locally hosted website. Opening this link on your device or will open to the webapp.

Next.js supports hot-reloading, so every time you save a file with a code change, you should see it within a few seconds on your device. 

## Development

We're using the [Next.js](https://nextjs.org/docs) framework for [React](https://reactjs.org/docs/getting-started.html). 

The app is written in [TypeScript](https://expo.dev/client): a dialect of JavaScript with type annotations and type checking. To run the type checker in the background, run `yarn tsc --watch`.

All code is auto-formatted with [Prettier](https://prettier.io). Code formatting is also enforced in CI. It's a good idea to set up your editor to format code on save, so you don't have to worry about this. To format your code, run `yarn prettier`.

We use the [Jest](https://jestjs.io) test framework for testing. Please write tests for anything that's easily testable. To run the test suite in the background, run `yarn test`.

## CI (GitHub Actions)

Every time code is pushed, we run the following:

- **Tests**: The entire test suite.
- **Typecheck**: make sure that all TypeScript annotations check out, and that all code is well-typed.
- **Prettier check**: make sure that all code is well-formatted and meets the style guide.
- **Schema generation**: generate a [JSON-schema](https://json-schema.org) for the profile data.

## Release Notes

### Sprint 5: `v0.5.0`

#### Features

- App reworked into a webapp running on the Next.js framework for React
- Buttons on recent profiles on home screen to delete profiles
- Video attachment functionality
- Buttons on profile create screen for directly accessing device camera for attachments
- Redesigned and polished UI
- Overhauled share button with new QR code and PIN fucntionality
- Functional end-to-end encryption of all patient data

#### Bug Fixes

- Optimized performance of webapp
- Fixed bug where image attachments would be corrupted

#### Known Issues

- Required fields popup in create profile screen doesn't correctly identify what is required

### Sprint 4: `v0.4.0`

#### Features

- Added editing existing patient profile functionality
- Added delete profile functionality for patient profiles

#### Bug Fixes

- Fixed issue that deleted large groups of profiles by accident

#### Known Issues

- App is slow, especially when trying to view a profile
- Editing profiles does not include images from the previous version

### Sprint 3: `v0.3.0`

#### Features

- Added printing functionality for patient profiles
- Automatic collapse of patient views added
- Included section to direct area of odontegenic injury
- Added highligting to designate urgent patient notices

#### Bug Fixes

- Fixed clicking on an image not correctly directing to the image view
- Profile attatchments now transfer alongside demographic information

#### Known Issues

- Cryptography operations are glacially slow, because React Native doesn't support the Web Crypto API

### Sprint 2: `v0.2.0`

#### Features

- After a profile has been completed, generate a URL containing that profile's data for transfer (#28)
- View to enter a URL to view a profile somebody else has sent you (#28)
- View to display the contents of a profile received from another user
- System to encrypt and decrypt profile data, using keys stored on-device (#30, #29)
- Added build, test, and tooling documentation to this `README.md`

#### Bug Fixes

- Fixed uselesss "receive profile" button (now: it's linked to the receive profile view)
- Removed debug functionality where local storage would get erased when tapping on a profile name

#### Known Issues

- Cryptography operations are glacially slow, because React Native doesn't support the Web Crypto API
- Profile attachments do not transfer alongside demographic information

### Sprint 1: `v0.1.0`

#### Features

- Page to enter a patient profile, complete with identity information, a triage checklist, and image/media attachments
- Validate patient information against a ruleset: checking for e.g. a valid date of birth, completed fields, and required information.
  - Surface any violations of that ruleset in the user interface, guiding users towards inputting the correct data
- Use tooling to generate a JSON-schema for the data interchange format on every push.
- Rudimentary profile log, which displays the names of completed patient profiles, in the home screen of the app.

#### Bug fixes

- Fix jank in form entry fields by changing how the app handles form contents.
- Change navigation for more flexibility in deep linking (used in features not-yet-implemented).

#### Known Issues

- Images and media are stored inefficiently, in `AsyncStorage` as base64-encoded strings.
- No data encryption has been implemented at this time.
