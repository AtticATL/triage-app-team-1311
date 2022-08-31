.SUFFIXES: # disable builtin make rules
MAKEFLAGS := --jobs=$(shell nproc) --no-builtin-rules

EXPORT=drugsatfda20220726

.PHONY: all
all: $(EXPORT)

ingredients.json: 
	python3 generate_ingredients.py

drugs.db: $(EXPORT)
	rm -f drugs.db
	cd $(EXPORT) && sqlite3 ../drugs.db  <../drugs.sql

$(EXPORT).zip:
	curl -L -o $@ "https://www.fda.gov/media/89850/download"

$(EXPORT): $(EXPORT).zip
	unzip -d $(EXPORT) $(EXPORT).zip
