const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  const sql = 'SELECT * FROM Timesheet WHERE id = $timesheetId';
  const values = {$timesheetId: timesheetId};
  db.get(sql, values, (error, timeSheet) => {
    if (error) {
      next(error);
    } else if (timeSheet) {
      req.timeSheet = timeSheet;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

timesheetsRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId';
  const values = { $employeeId: req.params.employeeId};
  db.all(sql, values, (error, timesheets) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({timesheets: timesheets});
    }
  });
});

timesheetsRouter.post('/', (req, res, next) => {
	// console.log(req.body);
	// console.log(req.params);

  const date = req.body.timesheet.date,
        hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        employeeId = req.body.timesheet.employeeId;
  const employeeSql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
  const employeeValues = {$employeeId: employeeId};
  db.get(employeeSql, employeeValues, (error, employee) => {
    if (error) {
      next(error);
    } else {
      if (!date || !hours || !rate || !employeeId) {
        return res.sendStatus(400);
      }

      const sql = 'INSERT INTO Timesheet (date, hours, rate, employee_id)' +
          'VALUES ($date, $hours, $rate, $employeeId)';
      const values = {
        $date: date,
        $hours: hours,
        $rate: rate,
        $employeeId: employeeId,
      };

      db.run(sql, values, function(error) {
        if (error) {
          next(error);
        } else {
          db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
            (error, timesheet) => {
              res.status(201).json({timesheet: timesheet});
            });
        }
      });
    }
  });
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
  const date = req.body.timesheet.date,
        hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        employeeId = req.body.timesheet.employeeId;
  const employeeSql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
  const employeeValues = {$employeeId: employeeId};
  db.get(employeeSql, employeeValues, (error, employee) => {
    if (error) {
      next(error);
    } else {
      if (!date || !hours || !rate || !employee) {
        return res.sendStatus(400);
      }

      const sql = 'UPDATE Timesheet SET date = $date, hours = $hours, ' +
          'rate = $rate, employee_id = $employeeId ' +
          'WHERE Timesheet.id = $timesheetId';
      const values = {
        $date: date,
        $hours: hours,
        $rate: rate,
        $employeeId: employeeId,
        $timesheetId: req.params.timesheetId
      };

      db.run(sql, values, function(error) {
        if (error) {
          next(error);
        } else {
          db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
            (error, timesheet) => {
              res.status(200).json({timesheet: timesheet});
            });
        }
      });
    }
  });
});

timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
  const sql = 'DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId';
  const values = {$timesheetId: req.params.timesheetId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(204);
    }
  });
});


module.exports = timesheetsRouter;
