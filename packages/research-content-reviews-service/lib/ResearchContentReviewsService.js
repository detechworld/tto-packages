import { AccessService } from '@detechworld/access-service';
import { BlockchainService } from '@detechworld/blockchain-service';
import { Singleton } from '@detechworld/toolbox';
import { ResearchContentReviewsHttp } from './ResearchContentReviewsHttp';
import deipRpc from '@detechworld/rpc-client';
import crypto from '@detechworld/lib-crypto';

class ResearchContentReviewsService extends Singleton {

  accessService = AccessService.getInstance();
  blockchainService = BlockchainService.getInstance();
  researchContentReviewsHttp = ResearchContentReviewsHttp.getInstance();

  createReview(privKey, {
    author,
    researchContentExternalId,
    content,
    weight,
    assessment,
    disciplines,
    extensions
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const offchainMeta = { review: { content: content } };

        const [review_external_id, create_review_op] = deipRpc.operations.createEntityOperation(['create_review', {
          author: author,
          research_content_external_id: researchContentExternalId,
          content: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.review)).buffer)),
          weight: weight,
          assessment_model: assessment,
          disciplines: disciplines,
          extensions: extensions
        }], refBlock);

        return this.blockchainService.signOperations([create_review_op], privKey, refBlock)
          .then((signedTx) => this.researchContentReviewsHttp.createReview(signedTx, offchainMeta));
      })
  }

  voteForReview(privKey, {
    voter,
    reviewExternalId,
    disciplineExternalId,
    weight,
    extensions
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [review_vote_external_id, create_review_vote_op] = deipRpc.operations.createEntityOperation(['vote_for_review', {
          voter: voter,
          review_external_id: reviewExternalId,
          discipline_external_id: disciplineExternalId,
          weight,
          extensions
        }], refBlock);

        return this.blockchainService.signOperations([create_review_vote_op], privKey, refBlock)
          .then((signedTx) => this.blockchainService.sendTransactionAsync(signedTx));
      })
  }


  getReviewRequestsByExpert(username, status) {
    return this.researchContentReviewsHttp.getReviewRequestsByExpert(username, status);
  }

  getReviewRequestsByRequestor(username, status) {
    return this.researchContentReviewsHttp.getReviewRequestsByRequestor(username, status);
  }

  createReviewRequest({
    researchContentExternalId,
    expert
  }) {
    const request = {
      researchContentExternalId,
      expert
    }
    return this.researchContentReviewsHttp.createReviewRequest(request);
  }

  denyReviewRequest(id) {
    return this.researchContentReviewsHttp.denyReviewRequest(id);
  }

  getReview(reviewExternalId) {
    return this.researchContentReviewsHttp.getReview(reviewExternalId);
  }

  getReviewsByResearch(researchExternalId) {
    return this.researchContentReviewsHttp.getReviewsByResearch(researchExternalId);
  }

  getReviewsByResearchContent(researchContentExternalId) {
    return this.researchContentReviewsHttp.getReviewsByResearchContent(researchContentExternalId);
  }

  getReviewsByAuthor(author) {
    return this.researchContentReviewsHttp.getReviewsByAuthor(author);
  }

  getReviewVotes(reviewExternalId) {
    return this.researchContentReviewsHttp.getReviewVotes(reviewExternalId);
  }
}

export {
  ResearchContentReviewsService
};
