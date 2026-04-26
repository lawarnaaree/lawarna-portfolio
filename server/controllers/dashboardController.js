import { dashboardModel } from '../models/dashboardModel.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const [stats, activity, engagement] = await Promise.all([
      dashboardModel.getStats(),
      dashboardModel.getRecentActivity(),
      dashboardModel.getEngagementOverTime()
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        activity,
        engagement
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    next(error);
  }
};
