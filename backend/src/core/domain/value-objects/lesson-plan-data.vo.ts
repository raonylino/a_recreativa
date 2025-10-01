export interface LessonPlanDataProps {
  objectives?: string[];
  activities?: string[];
  evaluation?: string;
  resources?: string;
  duration?: string;
  targetAudience?: string;
  subject?: string;
}

export class LessonPlanData {
  private readonly props: LessonPlanDataProps;

  constructor(props: LessonPlanDataProps) {
    this.props = props;
  }

  public getObjectives(): string[] {
    return this.props.objectives || [];
  }

  public getActivities(): string[] {
    return this.props.activities || [];
  }

  public getEvaluation(): string | undefined {
    return this.props.evaluation;
  }

  public getResources(): string | undefined {
    return this.props.resources;
  }

  public getDuration(): string | undefined {
    return this.props.duration;
  }

  public getTargetAudience(): string | undefined {
    return this.props.targetAudience;
  }

  public getSubject(): string | undefined {
    return this.props.subject;
  }

  public toJSON(): LessonPlanDataProps {
    return { ...this.props };
  }

  public isEmpty(): boolean {
    return !this.props.objectives?.length &&
      !this.props.activities?.length &&
      !this.props.evaluation &&
      !this.props.resources;
  }
}
