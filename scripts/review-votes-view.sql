-- Create a view to get vote counts for reviews
CREATE OR REPLACE VIEW review_vote_counts AS
SELECT 
    review_id,
    COUNT(CASE WHEN vote_type = 'Up' THEN 1 END) as upvotes,
    COUNT(CASE WHEN vote_type = 'Down' THEN 1 END) as downvotes
FROM review_votes
GROUP BY review_id; 