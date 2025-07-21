import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VoteType } from "@/services/votes.service";

interface VoteState {
  upvotes: number;
  downvotes: number;
  userVote?: VoteType;
}

interface ReviewVotesState {
  votes: Record<string, VoteState>;
}

const initialState: ReviewVotesState = {
  votes: {},
};

export const reviewVotesSlice = createSlice({
  name: "reviewVotes",
  initialState,
  reducers: {
    setVotes: (
      state,
      action: PayloadAction<{
        reviewId: string;
        upvotes: number;
        downvotes: number;
        userVote?: VoteType;
      }>
    ) => {
      const { reviewId, ...voteData } = action.payload;
      state.votes[reviewId] = voteData;
    },
    optimisticallyUpdateVote: (
      state,
      action: PayloadAction<{
        reviewId: string;
        voteType: VoteType;
        isRemovingVote: boolean;
      }>
    ) => {
      const { reviewId, voteType, isRemovingVote } = action.payload;
      const currentVotes = state.votes[reviewId] || {
        upvotes: 0,
        downvotes: 0,
      };
      const currentUserVote = currentVotes.userVote;

      // If removing a vote
      if (isRemovingVote) {
        if (voteType === "Up") {
          currentVotes.upvotes -= 1;
        } else {
          currentVotes.downvotes -= 1;
        }
        currentVotes.userVote = undefined;
      }
      // If changing vote type
      else if (currentUserVote && currentUserVote !== voteType) {
        if (voteType === "Up") {
          currentVotes.upvotes += 1;
          currentVotes.downvotes -= 1;
        } else {
          currentVotes.upvotes -= 1;
          currentVotes.downvotes += 1;
        }
        currentVotes.userVote = voteType;
      }
      // If adding new vote
      else if (!currentUserVote) {
        if (voteType === "Up") {
          currentVotes.upvotes += 1;
        } else {
          currentVotes.downvotes += 1;
        }
        currentVotes.userVote = voteType;
      }

      state.votes[reviewId] = currentVotes;
    },
    revertVoteUpdate: (
      state,
      action: PayloadAction<{
        reviewId: string;
        upvotes: number;
        downvotes: number;
        userVote?: VoteType;
      }>
    ) => {
      const { reviewId, ...voteData } = action.payload;
      state.votes[reviewId] = voteData;
    },
  },
});

export const { setVotes, optimisticallyUpdateVote, revertVoteUpdate } =
  reviewVotesSlice.actions;

export default reviewVotesSlice.reducer;
