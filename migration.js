const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite')


db.serialize(function() {

  db.run("CREATE TABLE IF NOT EXISTS Employee (`id` INTEGER NOT NULL,`name` TEXT NOT NULL,`position` TEXT NOT NULL,`wage` INT NOT NULL, `is_current_employee`	INT NOT NULL DEFAULT 1, PRIMARY KEY(`id`));");

  db.run("CREATE TABLE IF NOT EXISTS Timesheet (`id` INTEGER NOT NULL, `hours` INT NOT NULL, `rate` INT NOT NULL, `date` INT NOT NULL, `employee_id` INT NOT NULL, PRIMARY KEY(`id`), FOREIGN KEY ('employee_id') REFERENCES Employee('id'));");

  db.run("CREATE TABLE IF NOT EXISTS Menu (`id` INTEGER NOT NULL, `title` TEXT NOT NULL, PRIMARY KEY(`id`));");

  db.run("CREATE TABLE IF NOT EXISTS MenuItem (`id` INTEGER NOT NULL, `name` TEXT NOT NULL, `description` TEXT, `inventory` INT NOT NULL, `price`	INT NOT NULL, `menu_id`	INT NOT NULL, PRIMARY KEY(`id`), FOREIGN KEY ('menu_id') REFERENCES menu('id'));");

});
