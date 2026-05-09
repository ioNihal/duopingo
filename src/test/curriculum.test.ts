import { describe, it, expect } from 'vitest';
import { courses } from '../data/courses/javascript';
import { runJavascript } from '../engine/JavascriptRunner';

describe('Curriculum Verification', () => {

    courses.forEach(course => {
        describe(`Course: ${course.title}`, () => {
            course.lessons.forEach(lesson => {
                describe(`Lesson: ${lesson.title}`, () => {
                    lesson.problems.forEach(problem => {
                        it(`should solve problem: ${problem.id}`, async () => {
                            if (!problem.solution) {
                                console.warn(`Skipping problem ${problem.id} (no solution provided)`);
                                return;
                            }

                            // 1. Run the solution code
                            const result = await runJavascript(problem.solution);
                            expect(result.success).toBe(true);

                            // 2. Run validation logic against the solution output
                            if (problem.validationCode) {
                                const logsJson = JSON.stringify(result.output);
                                const validationFullCode = `
                  const logs = ${logsJson};
                  ${problem.validationCode}
                `;
                                const valResult = await runJavascript(validationFullCode);

                                if (!valResult.success) {
                                    console.error(`Validation failed for ${problem.id}: ${valResult.error}`);
                                }
                                expect(valResult.success).toBe(true);
                            }
                        });
                    });
                });
            });
        });
    });
});
