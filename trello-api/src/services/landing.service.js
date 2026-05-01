import PlanRepo from '~/repo/adminPlan.repo'

export default class LandingService {
  static fetchPlan = async () => {
    const plans = await PlanRepo.findMany({
      filter: {
        isDeleted: false,
        status: 'active'
      },
      options: {
        sort: { currentPrice: 1 }
      }
    })

    return plans
  }
}
