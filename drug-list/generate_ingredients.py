#!/usr/bin/env python3
import sqlite3
import json


def main():
    conn = sqlite3.connect("drugs.db");

    ingredients = set()
    for (joined,) in conn.execute("select distinct active_ingredient from products;"):
        for text in joined.split(";"):
            text = text.strip()
            text = text.title()
            ingredients.add(text)

    ingredients = sorted(ingredients)

    with open("ingredients.json", "w") as f:
        json.dump(ingredients, f)
    print("Done---generated ingredients.json")


if __name__ == "__main__": main()
