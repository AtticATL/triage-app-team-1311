-- for sqlite3

drop table if exists products;
create table products(
	appl_no integer,
	product_no integer,
	form text,
	strength text,
	reference_drug text,
	drug_name text,
	active_ingredient text,
	reference_standard text
);

.mode tabs
.import --skip 1 Products.txt products

-- Something funky in the dataset with appl_no 214737. Just delete the data for now.
delete from products where appl_no = 214737;
