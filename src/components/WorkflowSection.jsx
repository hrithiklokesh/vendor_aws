import React from "react";
import "../styles/WorkflowSection.css";
import WorkflowStep from "./WorkflowStep";
import WorkflowDescription from "./WorkflowDescription";

const WorkflowSection = () => {
  return (
    <section className="workflow-section-wrapper">
      <div className="page-wrapper">
        <header className="header">
          <h1 className="how-we-work">How We Work</h1>
          <p className="transform-business">
            Ready to transform your business? Here's how our seamless process works:
          </p>
        </header>

        <main className="workflow-container">
          <section className="workflow-section" style={{ "--section-index": 0 }}>
            <WorkflowStep position="left" title="Post your requirement" icon={null} />
            <WorkflowDescription text="Describe your procurement or project needs" position="left" className="visible" />
          </section>

          <section className="workflow-section" style={{ "--section-index": 1 }}>
            <WorkflowStep position="right" title="Project Manager Assigned" icon={null} />
            <WorkflowDescription text="A dedicated expert will be assigned to guide you." position="right" className="visible" />
          </section>

          <section className="workflow-section" style={{ "--section-index": 2 }}>
            <WorkflowStep position="left" title="Compare & Choose" icon={null} />
            <WorkflowDescription text="Receive quotes from verified vendors and select the best fit." position="left" className="visible" />
          </section>

          <section className="workflow-section" style={{ "--section-index": 3 }}>
            <WorkflowStep position="right" title="Manage & Track" icon={null} />
            <WorkflowDescription text="Manage and Track your expenses" position="right" className="visible" />
          </section>

          <section className="workflow-section" style={{ "--section-index": 4 }}>
            <WorkflowStep position="left" title="Forecasting & Insights" icon={null} />
            <WorkflowDescription text="Get data-driven forecasts to optimize outcomes." position="left" className="visible" />
          </section>

          <section className="workflow-section" style={{ "--section-index": 5 }}>
            <WorkflowStep position="right" title="Secure payments" icon={null} />
            <WorkflowDescription text="Seamless, transparent transaction" position="right" className="visible" />
          </section>

          <section className="workflow-section" style={{ "--section-index": 6 }}>
            <WorkflowStep position="left" title="Project Report Submission" icon={null} />
            <WorkflowDescription text="Receive a comprehensive report detailing project execution." position="left" className="visible" />
          </section>

          <section className="workflow-section" style={{ "--section-index": 7, position: "relative" }}>
            <WorkflowStep
              position="right"
              title="Post-Sales Support"
              icon="https://static.codia.ai/image/2025-03-13/e419e831-5baa-4208-95f2-3e5494d21010.svg"
            />
            <WorkflowDescription text="Benefit from after-sales services and continuous assistance." position="right" className="visible" />
            <div className="material-symbols-target" />
          </section>
        </main>
      </div>
    </section>
  );
};

export default WorkflowSection;