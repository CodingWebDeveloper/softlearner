import {
  Vote,
  VoteType,
  ReviewWithVotes,
  IVotesService,
} from "./interfaces/service.interfaces";
import { IVotesDAL } from "@/lib/di/interfaces/dal.interfaces";

export class VotesService implements IVotesService {
  constructor(private votesDAL: IVotesDAL) {}

  async upsertVote(
    userId: string,
    reviewId: string,
    voteType: VoteType
  ): Promise<Vote | null> {
    return this.votesDAL.upsertVote(userId, reviewId, voteType);
  }

  async getReviewVotes(
    reviewId: string,
    userId?: string
  ): Promise<ReviewWithVotes> {
    return this.votesDAL.getReviewVotes(reviewId, userId);
  }
}
