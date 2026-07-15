import type { ProblemDetails } from "./problem-details";

export class ProblemDetailsError extends Error {
	public readonly problemDetails: ProblemDetails;

	constructor(problemDetails: ProblemDetails) {
		super(problemDetails.title || "An API error occurred.");
		this.name = "ProblemDetailsError";
		this.problemDetails = problemDetails;

		// Set the prototype explicitly.
		Object.setPrototypeOf(this, ProblemDetailsError.prototype);
	}
}
