const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const board = sequelize.define('board', {
    company_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    user_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    board_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    board_color: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    board_order: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
    },
    created_by: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
})
module.exports = board

// {
//   "status": "success",
//   "message": "boards list found successfully",
//   "data": {
//       "task": {},
//       "columns": {
//           "column-varun": {
//               "id": 19,
//               "text": "varun",
//               "theme": "primary",
//               "tasks": []
//           }
//       },
//       "columnOrder": [
//           "column-varun"
//       ]
//   }

// {
//     "status": "success",
//     "message": "Boards list found successfully",
//     "data": {
//         "task": {},
//         "columns": {
//             "column-varun": {
//                 "id": 19,
//                 "text": "varun",
//                 "theme": "primary",
//                 "tasks": []
//             },
//             "column-project": {
//                 "id": 20,
//                 "text": "project",
//                 "theme": "info",
//                 "tasks": []
//             }
//         },
//         "columnOrder": [
//             "column-column-varun"
//         ]
//     }
// }
// 

// exports.boardList = async (req, res) => {
//   const {column_order} = req.body
//   try {
//     const boards = await board.findAll({
//       where: { company_id: req.headers["x-id"] },
//     });
//     const boardData = {
//       task: {},
//       columns: {},
//       columnOrder: [],
//     };
//     boards.forEach((board) => {
//       const columnKey = `column-${board.board_name}`;
//       boardData.columns[columnKey] = {
//         id: board.id,
//         text: board.board_name,
//         theme: board.board_color,
//         tasks: [],
//       };
//       boardData.columnOrder.push(columnKey);
//     });

//     return Helper.response(
//       "success",
//       "boards list found successfully",
//       boardData,
//       res,
//       200
//     );
//   } catch (err) {
//     console.error(err);
//     return Helper.response("failed", err.message, [], res, 200);
//   }
// };


// exports.boardList = async (req, res) => {
//   try {
//     const boards = await board.findAll({
//       where: { company_id: req.headers['x-id'] },
//     });

//     const boardData = {
//       task: {},
//       columns: {},
//       columnOrder: [],
//     };

//     boards.forEach((board) => {
//       const columnKey = `column-${board.board_name}`;
//       boardData.columns[columnKey] = {
//         id: board.id,
//         text: board.board_name,
//         theme: board.board_color,
//         tasks: [],
//       };
//       // Add each columnKey to columnOrder
//       boardData.columnOrder.push(columnKey);
//     });

//     return Helper.response(
//       'success',
//       'Boards list found successfully',
//       boardData,
//       res,
//       200
//     );
//   } catch (err) {
//     console.error(err);
//     return Helper.response('failed', err.message, [], res, 200);
//   }
// };

// exports.boardList = async (req, res) => {
//   const { columnOrder } = req.body;

//   try {
//     // If columnOrder is provided in the request, update the column order in the database
//     if (columnOrder && Array.isArray(columnOrder)) {
//       const updateResult = await board.update(
//         { column_order: columnOrder },
//         {
//           where: { company_id: req.headers['x-id'] },
//         }
//       );

//       if (updateResult[0] === 0) {
//         return Helper.response("failed", "No boards were updated", [], res, 200);
//       }
//     }

//     // Fetch the boards after the update
//     const boards = await board.findAll({
//       where: { company_id: req.headers['x-id'] },
//     });

//     const boardData = {
//       task: {},
//       columns: {},
//       columnOrder: [],
//     };

//     // Create a map to store columns and columnOrder from the database
//     const columnsMap = {};

//     boards.forEach((board) => {
//       const columnKey = `column-${board.board_name}`; // e.g., 'varun', 'shivam'
//       columnsMap[columnKey] = {
//         id: board.id,
//         text: board.board_name,
//         theme: board.board_color,
//         tasks: [], 
//       };
//     });

//     // Now push the columns into columnOrder in the correct order as per the updated columnOrder
//     if (columnOrder && Array.isArray(columnOrder)) {
//       columnOrder.forEach((columnKey) => {
//         const cleanedKey = columnKey.replace('column-', ''); // Remove the 'column-' prefix
//         if (columnsMap[cleanedKey]) {
//           boardData.columns[cleanedKey] = columnsMap[cleanedKey];
//           boardData.columnOrder.push(columnKey); // Push the column with the prefix 'column-'
//         }
//       });
//     } else {
//       // If no columnOrder is provided, show the columns in default order (or based on their current position)
//       boards.forEach((board) => {
//         const columnKey = board.board_name;
//         boardData.columns[columnKey] = columnsMap[columnKey];
//         boardData.columnOrder.push(`${columnKey}`);
//       });
//     }

//     return Helper.response(
//       "success",
//       "boards list found successfully",
//       boardData,
//       res,
//       200
//     );
//   } catch (err) {
//     console.error(err);
//     return Helper.response("failed", err.message, [], res, 200);
//   }
// };
