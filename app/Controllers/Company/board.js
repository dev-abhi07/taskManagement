const Helper = require("../../Helper/helper");
const board = require("../../Models/board");
exports.createBoard = async (req, res) => {
  const { title, color } = req.body;

  try {
    const boards = await board.create({
      board_name: title,
      board_color: color.value,
      board_order: [`column-${title}`],
      company_id: req.headers["x-id"],
      created_by: req.headers["x-id"],
      status: true,
      user_id: req.headers["x-id"],
    });

    if (!boards) {
      return Helper.response("failed", "board not created", [], res, 200);
    }

    const boardData = {
      task: {},
      columns: {
        [`column-${boards.board_name}`]: {
          id: boards.id,
          text: boards.board_name,
          theme: boards.board_color,
          tasks: [],
        },
      },
      columnOrder: [`column-${boards.board_name}`],
    };

    return Helper.response(
      "success",
      "board created successfully",
      boardData,
      res,
      200
    );
  } catch (err) {
    console.log(err);
    return Helper.response("failed", err.message, {}, res, 200);
  }
};



exports.deleteboard = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      return Helper.response("failed", "Please provide board id", [], res, 200);
    }
    const boards = await board.destroy({
      where: { id: id, company_id: req.headers["x-id"] },
    });
    if (boards) {
      return Helper.response(
        "success",
        "board deleted successfully",
        boards,
        res,
        200
      );
    } else {
      return Helper.response("failed", "Failed to delete board", [], res, 200);
    }
  } catch (err) {
    console.log(err);
    return Helper.response("failed", err.message, {}, res, 200);
  }
};

exports.updateBoard = async (req, res) => {
  const { id } = req.body;
  try {
    const updateData = {
      board_name: req.body.title,
      board_color: req.body.color.value,
      company_id: req.headers["x-id"],
      created_by: req.headers["x-id"],
      status: true,
      user_id: req.headers["x-id"],
      board_order: [`column-${req.body.title}`],
    };
    if (!id || !updateData) {
      return Helper.response(
        "failed",
        "Please provide all required fields",
        [],
        res,
        200
      );
    }

    const [updatedRows] = await board.update(updateData, { where: { id: id } });
    if (updatedRows === 0) {
      return Helper.response(
        "failed",
        "Failed to update department",
        [],
        res,
        200
      );
    }
    return Helper.response(
      "success",
      "board updated successfully",
      [],
      res,
      200
    );
  } catch (err) {
    console.log(err);
    return Helper.response("failed", err.message, {}, res, 200);
  }
};


exports.deleteBoard = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return Helper.response("failed", "Please provide board id", [], res, 200);
        }
        const boards = await board.destroy({
            where: { id: id, company_id: req.headers["x-id"] },
        });
        if (boards) {
            return Helper.response(
                "success",
                "board deleted successfully",
                boards,
                res,
                200
            );
        } else {
            return Helper.response("failed", "Failed to delete board", [], res, 200);
        }
    } catch (err) {
        console.log(err);
        return Helper.response("failed", err.message, {}, res, 200);
    }
};


exports.boardList = async (req, res) => {
  const { columnOrder } = req.body;
  const companyId = req.headers['x-id'];
  try {
    if (columnOrder && Array.isArray(columnOrder)) {
      const updateResult = await board.update(
        { board_order: columnOrder },
        { where: { company_id: companyId } }
      );

      if (updateResult[0] === 0) {
        return Helper.response("failed", "No boards were updated", [], res, 200);
      }
    }
    const boards = await board.findAll({
      where: { company_id: companyId },
      attributes: ["id", "board_name", "board_color", "board_order"],
    });

    if (!boards.length) {
      return Helper.response("failed", "No boards found", [], res, 200);
    }
    const list = boards.map((item=>item.toJSON))
    // console.log(list)
    let boardOrder = boards[0].board_order || [];
    // console.log(boardOrder)
    // let boardOrder = list.map(item=>item.board_order)
    // console.log(boardOrder)
    if (!Array.isArray(boardOrder)) {
      boardOrder = []; 
    }
    const finalColumnOrder = columnOrder && Array.isArray(columnOrder) ? columnOrder : boardOrder;

    const boardData = {
      task: {},
      columns: {},
      columnOrder: [],
    };

    const columnsMap = {};
    boards.forEach((board) => {
      const columnKey = `column-${board.board_name}`;
      columnsMap[columnKey] = {
        id: board.id,
        text: board.board_name,
        theme: board.board_color,
        tasks: [],
      };
    });
    finalColumnOrder.forEach((columnKey) => {
      if (columnsMap[columnKey]) {
        boardData.columns[columnKey] = columnsMap[columnKey];
        boardData.columnOrder.push(columnKey);
      }
    });
    if (boardData.columnOrder.length === 0) {
      boards.forEach((board) => {
        const columnKey = `column-${board.board_name}`;
        boardData.columns[columnKey] = columnsMap[columnKey];
        boardData.columnOrder.push(columnKey);
      });
    }

    return Helper.response("success", "Boards list found successfully", boardData, res, 200);
  } catch (err) {
    console.error(err);
    return Helper.response("failed", err.message, [], res, 500);
  }
};



// exports.boardList = async (req, res) => {
//   const { columnOrder } = req.body;
//   const companyId = req.headers["x-id"];

//   try {
//     if (columnOrder && Array.isArray(columnOrder)) {
//       const updateResult = await board.update(
//         { board_order: columnOrder },
//         { where: { company_id: companyId } }
//       );

//       if (updateResult[0] === 0) {
//         return Helper.response("failed", "No boards were updated", [], res, 200);
//       }
//     }
//     let boards = await board.findAll({
//       where: { company_id: companyId },
//       attributes: ["id", "board_name", "board_color", "board_order"],
//     });

//     boards = boards.map((item) => item.toJSON()); 

//     if (!boards.length) {
//       return Helper.response("failed", "No boards found", [], res, 200);
//     }

//     let boardOrder = boards.flatMap((b) => (Array.isArray(b.board_order) ? b.board_order : []));
//     console.log(boardOrder)

//     if (!boardOrder.length) {
//       boardOrder = []; // Ensure boardOrder is always an array
//     }

//     // If columnOrder is not provided in request, use board_order from the database
//     const finalColumnOrder = columnOrder && Array.isArray(columnOrder) ? columnOrder : boardOrder;

//     const boardData = {
//       task: {},
//       columns: {},
//       columnOrder: [],
//     };

//     const columnsMap = {};

//     // Populate the columnsMap with board data
//     boards.forEach((board) => {
//       const columnKey = `column-${board.board_name}`;
//       columnsMap[columnKey] = {
//         id: board.id,
//         text: board.board_name,
//         theme: board.board_color,
//         tasks: [],
//       };
//     });

//     // Reorder columns based on the final column order
//     finalColumnOrder.forEach((columnKey) => {
//       if (columnsMap[columnKey]) {
//         boardData.columns[columnKey] = columnsMap[columnKey];
//         boardData.columnOrder.push(columnKey);
//       }
//     });

//     // If no columnOrder exists, use the default board order from the database
//     if (boardData.columnOrder.length === 0) {
//       boards.forEach((board) => {
//         const columnKey = `column-${board.board_name}`;
//         boardData.columns[columnKey] = columnsMap[columnKey];
//         boardData.columnOrder.push(columnKey);
//       });
//     }

//     return Helper.response("success", "Boards list found successfully", boardData, res, 200);
//   } catch (err) {
//     console.error(err);
//     return Helper.response("failed", err.message, [], res, 500);
//   }
// };


