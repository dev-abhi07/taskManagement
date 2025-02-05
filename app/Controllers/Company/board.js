const Helper = require("../../Helper/helper");
const board = require("../../Models/board");
const department = require("../../Models/department");
const priority = require("../../Models/priority");
const project = require("../../Models/project");
const task = require("../../Models/task");
const users = require("../../Models/users");
const { Op } = require("sequelize");
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

// exports.boardList = async (req, res) => {
//   const { columnOrder } = req.body;
//   const companyId = req.headers["x-id"];

//   try {
//     if (columnOrder && Array.isArray(columnOrder) && columnOrder.length > 0) {
//       await board.update(
//         { board_order: columnOrder },
//         { where: { company_id: companyId } }
//       );
//     }

//     const boards = await board.findAll({
//       where: { company_id: companyId },
//       attributes: ["id", "board_name", "board_color", "board_order"],
//     });

//     if (!boards.length) {
//       return Helper.response("failed", "No boards found", [], res, 200);
//     }
//     let boardOrder = boards
//       .map((item) => {
//         try {
//           return Array.isArray(item.board_order)
//             ? item.board_order
//             : JSON.parse(item.board_order);
//         } catch (err) {
//           console.error("Error parsing board_order:", err);
//           return [];
//         }
//       })
//       .flat()
//       .filter(Boolean);

//     boardOrder = [...new Set(boardOrder)];
//     if (!Array.isArray(boardOrder) || boardOrder.length === 0) {
//       boardOrder = [];
//     }

//     console.log("Fetched boardOrder from DB:", boardOrder);

//     const finalColumnOrder =
//       columnOrder && Array.isArray(columnOrder) && columnOrder.length > 0
//         ? columnOrder
//         : boardOrder;

//     console.log("finalColumnOrder:", finalColumnOrder);

//     const tasks = await task.findAll();

//     const taskList = tasks.map((item) => item.toJSON());

//     const usersList = await users.findAll({ attributes: ["id", "name"] });
//     const userMap = usersList.reduce((acc, user) => {
//       acc[user.id] = user.name;
//       return acc;
//     }, {});

//     const projectList = await project.findAll({
//       attributes: ["id", "project_title","department_id"],
//     });

//     const departmentList = await department.findAll({
//       attributes: ["id", "name"],
//     });

//     const departmentMap = departmentList.reduce((acc, dept) => {
//       acc[dept.id] =dept.name;
//       return acc;
//     }, {});



//     const projectMap = projectList.reduce((acc, project) => {
//       acc[project.id] = {
//         label: project.project_title,
//         value: project.id,
//         department_id: departmentMap[project.department_id]
//       };
//       return acc;
//     }, {});

   

//     const assignedUsers = await users.findAll({
//       where: {
//         id: { [Op.in]: taskList.flatMap((task) => task.assign_id) },
//       },
//       attributes: ["id", "name"],
//     });

//     const assignMap = assignedUsers.reduce((acc, user) => {
//       acc[user.id] = user.name;
//       return acc;
//     }, {});

//     const priorities = await priority.findAll({
//       attributes: ["id", "priority_name"],
//     })
//     const priorityMap = priorities.reduce((acc, priority) => {
//        acc[priority.id]=priority.priority_name
//        return acc;
//     },{})

//     const taskData = taskList.reduce((acc, item) => {
//       const taskKey = `task-${item.id}`;
//       const formattedAssignId = (item.assign_id || []).map((userId) => ({
//         label: assignMap[userId],
//         value: userId,
//       }));
//       acc[taskKey] = {
//         id: taskKey,
//         title: item.task_title,
//         desc: item.task_description,
//         board: item.board_id,
//         meta: {
//           // project_id: {
//           //   label: projectMap[item.project_id],
//           //   value: item.project_id,
//           // },
//           project_id: projectMap[item.project_id],

//           department_name: projectMap[item.project_id]?.department_id,
        
//           priority: {
//             label: priorityMap[item.priority],
//             value: item.priority,
//           },
//           board: item.board_id,
//           user_id: {
//             label: userMap[item.user_id],
//             value: item.user_id,
//           },
//           assign_id: formattedAssignId,
//           title: item.task_title,
//           description: item.task_description,
//           start_date: item.start_date,
//           end_date: item.end_date,
//         },
//       };
//       return acc;
//     }, {});

//     const boardData = {
//       task: taskData,
//       columns: {},
//       columnOrder: [],
//     };

//     const columnsMap = {};

//     boards.forEach((board) => {
//       const columnKey = `column-${board.board_name}`;
//       columnsMap[columnKey] = {
//         id: board.id,
//         text: board.board_name,
//         theme: board.board_color,
//         tasks: [],
//       };
//     });

//     // Object.values(taskData).forEach((task) => {
//     //   const board = boards.find((b) => b.id === task.board)
//     //   const columnKey = `column-${task.board}`;
//     //   if (columnsMap[columnKey]) {
//     //     columnsMap[columnKey].tasks.push(task.id);
//     //   }
//     // });
//     Object.values(taskData).forEach((task) => {
//       // console.log("Checking task.board:", task.board); // Debug log

//       const board = boards.find((b) => String(b.id) === String(task.board)); // Ensure same type
//       // console.log("Found board:", board); // Debug log

//       if (board) {
//         const columnKey = `column-${board.board_name}`;

//         if (columnsMap[columnKey]) {
//           columnsMap[columnKey].tasks.push(task.id);
//         }
//       } else {
//         // console.error(`Board not found for task.board: ${task.board}`);
//       }
//     });

//     finalColumnOrder.forEach((columnKey) => {
//       if (columnsMap[columnKey]) {
//         boardData.columns[columnKey] = columnsMap[columnKey];
//         boardData.columnOrder.push(columnKey);
//       }
//     });

//     if (boardData.columnOrder.length === 0) {
//       boards.forEach((board) => {
//         const columnKey = `column-${board.board_name}`;
//         boardData.columns[columnKey] = columnsMap[columnKey];
//         boardData.columnOrder.push(columnKey);
//       });
//     }

//     return Helper.response(
//       "success",
//       "Boards list found successfully",
//       boardData,
//       res,
//       200
//     );
//   } catch (err) {
//     console.error(err);
//     return Helper.response("failed", err.message, [], res, 500);
//   }
// };






//new inside boardList tasks intenally drag
// exports.boardList = async (req, res) => {
//   const { columnOrder, taskOrder } = req.body;
//   const companyId = req.headers["x-id"];

//   let homeId, items;
//   if (taskOrder && taskOrder.homeId && Array.isArray(taskOrder.items)) {
//     ({ homeId, items } = taskOrder);
//   }

//   try {
//     // Step 1: Update Board Order if Provided
//     if (columnOrder && Array.isArray(columnOrder) && columnOrder.length > 0) {
//       await board.update(
//         { board_order: columnOrder },
//         { where: { company_id: companyId } }
//       );
//     }

//     // Step 2: Update Task Order if Provided
//     if (taskOrder && typeof taskOrder === "object" && items) {
//       console.log("Updating Task Order:", items);
//       await task.update(
//         { task_order: items },
//         { where: { board_id: homeId } }
//       );
//     } else {
//       console.log("No taskOrder found in the request body. Skipping task order update.");
//     }

//     // Step 3: Fetch Boards from DB
//     const boards = await board.findAll({
//       where: { company_id: companyId },
//       attributes: ["id", "board_name", "board_color", "board_order"],
//     });

//     if (!boards.length) {
//       return Helper.response("failed", "No boards found", [], res, 200);
//     }

//     let boardOrder = boards
//       .map((item) => {
//         try {
//           return Array.isArray(item.board_order)
//             ? item.board_order
//             : JSON.parse(item.board_order);
//         } catch (err) {
//           console.error("Error parsing board_order:", err);
//           return [];
//         }
//       })
//       .flat()
//       .filter(Boolean);

//     boardOrder = [...new Set(boardOrder)];
//     if (!Array.isArray(boardOrder) || boardOrder.length === 0) {
//       boardOrder = [];
//     }

//     const finalColumnOrder =
//       columnOrder && Array.isArray(columnOrder) && columnOrder.length > 0
//         ? columnOrder
//         : boardOrder;

//     // Step 4: Fetch Tasks from DB
//     const tasks = await task.findAll({
//       attributes: [
//         "id", "task_title", "task_description", "board_id", "task_order", 
//         "assign_id", "start_date", "end_date", "priority", "project_id", "user_id"
//       ],
//       order: [["task_order", "ASC"]]  // Ensure tasks are ordered by task_order from the database
//     });

//     // Step 5: Convert Task Data to JSON
//     const taskList = tasks.map((item) => item.toJSON());
//     // console.log('taskList',taskList)

//     // Step 6: Fetch Users & Projects
//     const usersList = await users.findAll({ attributes: ["id", "name"] });
//     const userMap = usersList.reduce((acc, user) => {
//       acc[user.id] = user.name;
//       return acc;
//     }, {});

//     const projectList = await project.findAll({
//       attributes: ["id", "project_title", "department_id"],
//     });

//     const departmentList = await department.findAll({
//       attributes: ["id", "name"],
//     });

//     const departmentMap = departmentList.reduce((acc, dept) => {
//       acc[dept.id] = dept.name;
//       return acc;
//     }, {});

//     const projectMap = projectList.reduce((acc, project) => {
//       acc[project.id] = {
//         label: project.project_title,
//         value: project.id,
//         department_name: departmentMap[project.department_id],
//       };
//       return acc;
//     }, {});

//     // Step 7: Fetch Assigned Users
//     const assignedUsers = await users.findAll({
//       where: {
//         id: { [Op.in]: taskList.flatMap((task) => task.assign_id) },
//       },
//       attributes: ["id", "name"],
//     });

//     const assignMap = assignedUsers.reduce((acc, user) => {
//       acc[user.id] = user.name;
//       return acc;
//     }, {});

//     const priorities = await priority.findAll({
//       attributes: ["id", "priority_name"],
//     });

//     const priorityMap = priorities.reduce((acc, priority) => {
//       acc[priority.id] = priority.priority_name;
//       return acc;
//     }, {});

//     // Step 8: Organize Task Data with Task Order
//     const taskData = taskList.reduce((acc, item) => {
//       const taskKey = `task-${item.id}`;
//       const formattedAssignId = (item.assign_id || []).map((userId) => ({
//         label: assignMap[userId],
//         value: userId,
//       }));
//       acc[taskKey] = {
//         id: taskKey,
//         title: item.task_title,
//         desc: item.task_description,
//         board: item.board_id,
//         meta: {
//           project_id: projectMap[item.project_id],
//           department_name: projectMap[item.project_id]?.department_name,
//           priority: {
//             label: priorityMap[item.priority],
//             value: item.priority,
//           },
//           board: item.board_id,
//           user_id: {
//             label: userMap[item.user_id],
//             value: item.user_id,
//           },
//           assign_id: formattedAssignId,
//           title: item.task_title,
//           description: item.task_description,
//           start_date: item.start_date,
//           end_date: item.end_date,
//           task_order: item.task_order // Add the task_order field here
//         },
//       };
//       return acc;
//     }, {});

//     // Step 9: Initialize Board Data Structure
//     const boardData = {
//       task: taskData,
//       columns: {},
//       columnOrder: [],
//     };

//     const columnsMap = {};

//     boards.forEach((board) => {
//       const columnKey = `column-${board.board_name}`;
//       columnsMap[columnKey] = {
//         id: board.id,
//         text: board.board_name,
//         theme: board.board_color,
//         tasks: [],
//       };
//     });

//    console.log('taskData',Object.values(taskData))

//     // Step 10: Assign Tasks to Columns
//     // Step 10: Assign Tasks to Columns (updated to consider task_order in task.meta)
// Object.values(taskData).forEach((task) => {
//   const board = boards.find((b) => String(b.id) === String(task.board));

//   if (board && task.meta && Array.isArray(task.meta.task_order)) {
//     const columnKey = `column-${board.board_name}`;
    
//     // Ensure the tasks in the column are ordered by task_order from task.meta
//     if (columnsMap[columnKey]) {
//       columnsMap[columnKey].tasks.push(task.id);
      
//       // After pushing the task, we need to reorder the tasks in this column
//       const columnTasks = columnsMap[columnKey].tasks;

//       // Sort the tasks in the column based on the task_order array
//       columnsMap[columnKey].tasks = columnTasks.sort((taskA, taskB) => {
//         const indexA = task.meta.task_order.indexOf(taskA);
//         const indexB = task.meta.task_order.indexOf(taskB);
//         return indexA - indexB; // Sort by position in task_order array
//       });
//     }
//   }
// });


   


    

//     // Step 11: Handle task order properly when no taskOrder in body
//     Object.keys(columnsMap).forEach((columnKey) => {
      

//       // If taskOrder is not provided, fetch data from the database for task_order
//       const columnTasks = columnsMap[columnKey].tasks.map((taskId) => taskData[taskId]);
    
       
//       // Sort tasks by their task_order fetched from the database
//       // columnTasks.sort((a, b) => {
//       //   const taskOrderA = a.meta.task_order || 0;  // Default to 0 if task_order is missing
//       //   const taskOrderB = b.meta.task_order || 0;
//       //   return taskOrderA - taskOrderB;
//       // });

//       // Update column's tasks with sorted order
//       columnsMap[columnKey].tasks = columnTasks.map((task) => task.id);
    
//     });
    

//     // Step 12: Organize Columns in Response
//     finalColumnOrder.forEach((columnKey) => {
//       if (columnsMap[columnKey]) {
//         boardData.columns[columnKey] = columnsMap[columnKey];
//         boardData.columnOrder.push(columnKey);
//       }
//     });

//     if (boardData.columnOrder.length === 0) {
//       boards.forEach((board) => {
//         const columnKey = `column-${board.board_name}`;
//         boardData.columns[columnKey] = columnsMap[columnKey];
//         boardData.columnOrder.push(columnKey);
//       });
//     }

//     return Helper.response(
//       "success",
//       "Boards list found successfully",
//       boardData,
//       res,
//       200
//     );
//   } catch (err) {
//     console.error(err);
//     return Helper.response("failed", err.message, [], res, 500);
//   }
// };


//externally drag this functionality
exports.boardList = async (req, res) => {
  const { columnOrder, taskOrder, newHome, newItem } = req.body;
  const companyId = req.headers["x-id"];

  let homeId, items;
  if (taskOrder && taskOrder.homeId && Array.isArray(taskOrder.items)) {
    ({ homeId, items } = taskOrder);
  }

  try {
    // Step 1: Update Board Order if Provided
    if (columnOrder && Array.isArray(columnOrder) && columnOrder.length > 0) {
      await board.update(
        { board_order: columnOrder },
        { where: { company_id: companyId } }
      );
    }
       // Step 2: Update Task Order if Provided
    if (taskOrder && typeof taskOrder === "object" && items) {
      console.log("Updating Task Order:", items);
      await task.update(
        { task_order: items },
        { where: { board_id: homeId } }
      );
    } 
    // Step 2: Handle Task Reordering & Board Transfers
    if (newHome && newItem) {
      const allUpdates = [];

      // Update tasks in newHome board
      if (newHome.tasks.length > 0) {
        allUpdates.push(
          task.update(
            { board_id: newHome.id, task_order: newHome.tasks },
            { where: { id: newHome.tasks.map(t => t.split("-")[1]) } }
          )
        );
      }

      // Update tasks in newItem board
      if (newItem.tasks.length > 0) {
        allUpdates.push(
          task.update(
            { board_id: newItem.id, task_order: newItem.tasks },
            { where: { id: newItem.tasks.map(t => t.split("-")[1]) } }
          )
        );
      }

      await Promise.all(allUpdates);
    }

    // Step 3: Fetch Boards from DB
    const boards = await board.findAll({
      where: { company_id: companyId },
      attributes: ["id", "board_name", "board_color", "board_order"],
    });

    if (!boards.length) {
      return Helper.response("failed", "No boards found", [], res, 200);
    }

    let boardOrder = boards
      .map((item) => {
        try {
          return Array.isArray(item.board_order)
            ? item.board_order
            : JSON.parse(item.board_order);
        } catch (err) {
          console.error("Error parsing board_order:", err);
          return [];
        }
      })
      .flat()
      .filter(Boolean);

    boardOrder = [...new Set(boardOrder)];
    if (!Array.isArray(boardOrder) || boardOrder.length === 0) {
      boardOrder = [];
    }

    const finalColumnOrder =
      columnOrder && Array.isArray(columnOrder) && columnOrder.length > 0
        ? columnOrder
        : boardOrder;

    // Step 4: Fetch Tasks from DB
    const tasks = await task.findAll({
      attributes: [
        "id", "task_title", "task_description", "board_id", "task_order", 
        "assign_id", "start_date", "end_date", "priority", "project_id", "user_id"
      ],
      order: [["task_order", "ASC"]]
    });

    // Step 5: Convert Task Data to JSON
    const taskList = tasks.map((item) => item.toJSON());

    // Step 6: Fetch Users & Projects
    const usersList = await users.findAll({ attributes: ["id", "name"] });
    const userMap = usersList.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});

    const projectList = await project.findAll({
      attributes: ["id", "project_title", "department_id"],
    });

    const departmentList = await department.findAll({
      attributes: ["id", "name"],
    });

    const departmentMap = departmentList.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {});

    const projectMap = projectList.reduce((acc, project) => {
      acc[project.id] = {
        label: project.project_title,
        value: project.id,
        department_name: departmentMap[project.department_id],
      };
      return acc;
    }, {});

    // Step 7: Fetch Assigned Users
    const assignedUsers = await users.findAll({
      where: {
        id: { [Op.in]: taskList.flatMap((task) => task.assign_id) },
      },
      attributes: ["id", "name"],
    });

    const assignMap = assignedUsers.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});

    const priorities = await priority.findAll({
      attributes: ["id", "priority_name"],
    });

    const priorityMap = priorities.reduce((acc, priority) => {
      acc[priority.id] = priority.priority_name;
      return acc;
    }, {});

    // Step 8: Organize Task Data with Task Order
    const taskData = taskList.reduce((acc, item) => {
      const taskKey = `task-${item.id}`;
      const formattedAssignId = (item.assign_id || []).map((userId) => ({
        label: assignMap[userId],
        value: userId,
      }));
      acc[taskKey] = {
        id: taskKey,
        title: item.task_title,
        desc: item.task_description,
        board: item.board_id,
        meta: {
          project_id: projectMap[item.project_id],
          department_name: projectMap[item.project_id]?.department_name,
          priority: {
            label: priorityMap[item.priority],
            value: item.priority,
          },
          board: item.board_id,
          user_id: {
            label: userMap[item.user_id],
            value: item.user_id,
          },
          assign_id: formattedAssignId,
          title: item.task_title,
          description: item.task_description,
          start_date: item.start_date,
          end_date: item.end_date,
          task_order: item.task_order 
        },
      };
      return acc;
    }, {});

    // Step 9: Initialize Board Data Structure
    const boardData = {
      task: taskData,
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

    // Step 10: Assign Tasks to Columns
    Object.values(taskData).forEach((task) => {
        const board = boards.find((b) => String(b.id) === String(task.board));
      
        if (board && task.meta && Array.isArray(task.meta.task_order)) {
          const columnKey = `column-${board.board_name}`;
          
          // Ensure the tasks in the column are ordered by task_order from task.meta
          if (columnsMap[columnKey]) {
            columnsMap[columnKey].tasks.push(task.id);
            
            // After pushing the task, we need to reorder the tasks in this column
            const columnTasks = columnsMap[columnKey].tasks;
      
            // Sort the tasks in the column based on the task_order array
            columnsMap[columnKey].tasks = columnTasks.sort((taskA, taskB) => {
              const indexA = task.meta.task_order.indexOf(taskA);
              const indexB = task.meta.task_order.indexOf(taskB);
              return indexA - indexB; // Sort by position in task_order array
            });
          }
        }
      });

    // Step 12: Organize Columns in Response
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

    return Helper.response(
      "success",
      "Boards list updated successfully",
      boardData,
      res,
      200
    );
  } catch (err) {
    console.error(err);
    return Helper.response("failed", err.message, [], res, 500);
  }
};













