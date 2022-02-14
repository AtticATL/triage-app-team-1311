# OI TriageApp

App to help transfer patients with odontogenic infections.

# Release Notes

## Sprint 1: `v0.1.0`

### Features

- Page to enter a patient profile, complete with identity information, a triage checklist, and image/media attachments
- Validate patient information against a ruleset: checking for e.g. a valid date of birth, completed fields, and required information.
  - Surface any violations of that ruleset in the user interface, guiding users towards inputting the correct data
- Use tooling to generate a JSON-schema for the data interchange format on every push.
- Rudimentary profile log, which displays the names of completed patient profiles, in the home screen of the app.

### Bug fixes

- Fix jank in form entry fields by changing how the app handles form contents.
- Change navigation for more flexibility in deep linking (used in features not-yet-implemented).

### Known Issues

- Images and media are stored inefficiently, in `AsyncStorage` as base64-encoded strings.
- No data encryption has been implemented at this time.
