#!/usr/bin/env ts-node
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Profile } from "../lib/profile";

// Generate the schema
const jsonSchema = zodToJsonSchema(Profile, "profile");

console.log(JSON.stringify(jsonSchema, null, 4));
