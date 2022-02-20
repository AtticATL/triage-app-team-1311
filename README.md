# OI TriageApp

App to help transfer patients with odontogenic infections.

## Getting Started

To build the app, you need:

- [Node.js](https://nodejs.org/en/download/) version 16 (not 17)
- `yarn` (can be installed with `npm install --global yarn`)
- [Expo Go](https://expo.dev/client) app on your test device

Then, to run the app in Expo Go:

```sh
# Install dependencies
$ yarn install

# Build the app
$ yarn start
```

This will open a page in your browser with a QR code. Scan that code with your phone, and Expo Go will open, trigger a build of the app for the right platform, and start the app.

Expo supports hot-reloading, so every time you save a file with a code change, you should see it within a few seconds on your phone. If that doesn't work, shake your phone, and hit "Refresh" on the developer menu.

## Development

We're using the [Expo](https://docs.expo.dev) framework for [React Native](https://reactnative.dev). We're also using [NativeBase](https://nativebase.io), a component library for React Native, to make building good UIs a little easier. To start the app, run `yarn start`.

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
