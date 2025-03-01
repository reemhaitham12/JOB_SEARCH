import moment from 'moment';
import ExcelJS from 'exceljs';
import * as dbService from "../../DB/db.service.js";
import appModel from "../../DB/model/app.model.js"; // Assuming this is the correct model for applications
import { asyncHandler } from '../../utils/response/error.response.js';

export const generateApplicationsExcel = asyncHandler(async (req, res, next) => {
  const { companyId, date } = req.query;

  // Check for required parameters
  if (!companyId || !date) {
    return next(new Error("Company ID and Date are required", { cause: 400 }));
  }

  // Parse date to filter the range
  const startDate = moment(date).startOf('day');
  const endDate = moment(date).endOf('day');

  try {
    // Fetch applications for the specified company and date range
    const applications = await dbService.find({
      model: appModel,
      filter: {
        companyId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    });

    if (!applications || applications.length === 0) {
      return next(new Error("No applications found for the specified date", { cause: 404 }));
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    // Define columns for the Excel sheet
    worksheet.columns = [
      { header: "Application ID", key: "id", width: 20 },
      { header: "User ID", key: "userId", width: 20 },
      { header: "Company Name", key: "companyName", width: 30 },
      { header: "Position", key: "position", width: 30 },
      { header: "Applied Date", key: "appliedDate", width: 25 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Add rows for each application
    applications.forEach((app) => {
      worksheet.addRow({
        id: app._id,
        userId: app.userId,
        companyName: app.companyId, // Assuming this field is the name of the company
        position: app.jobId, // You might need to fetch the position from a Job model if it's a reference
        appliedDate: moment(app.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        status: app.status,
      });
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');

    // Send the Excel file to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
});
