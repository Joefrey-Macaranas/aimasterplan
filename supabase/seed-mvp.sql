-- MVP seed from :8083 prototype — generated, do not hand-edit. Source: http://localhost:8083 @ 2026-10-12T02:11:19.706Z
INSERT INTO courses(id,title,description) VALUES ('ai-masterplan','AI-MasterPlan','From zero coding to independent AI builder') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L1','ai-masterplan',1,'Understanding AI & Vibe Coding','AI, LLMs, prompts, app parts in plain words.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L2','ai-masterplan',2,'Setting Up Your Development Environment','Editor, terminal, git, Node, run locally.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L3','ai-masterplan',3,'Build Your First Website','Generate, style, navigate, debug, ship a site. PROJECT: Personal/Business Website.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L4','ai-masterplan',4,'Build Your First Real Application','Frontend, backend, APIs, JSON, REST, CRUD. PROJECT: Functional CRUD application.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L5','ai-masterplan',5,'Databases & User Accounts','Tables, queries, auth, sessions, env vars. PROJECT: Multi-user application.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L6','ai-masterplan',6,'AI Integration','LLM APIs, prompts, context, JSON, streaming, cost. PROJECT: AI-powered assistant.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L7','ai-masterplan',7,'AI Automation','Triggers, webhooks, schedules, approvals. PROJECT: Real-world AI automation.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L8','ai-masterplan',8,'AI Agents','Tools, memory, planning, verification, multi-agent. PROJECT: Autonomous task agent.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L9','ai-masterplan',9,'Full AI System Development','PRD to production SaaS. PROJECT: Production AI SaaS.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO levels(id,course_id,idx,title,summary) VALUES ('L10','ai-masterplan',10,'Build Independently','Fading hand-holding: plan, build, test, deploy solo. FINAL: own product.') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L1M1','L1',1,'AI Foundations','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L1M2','L1',2,'How Apps Work','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L2M1','L2',1,'Install Your Toolkit','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L2M2','L2',2,'Run Your First Project','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L3M1','L3',1,'Web Basics with AI','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L3M2','L3',2,'Ship a Complete Website','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L4M1','L4',1,'Client & Server','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L4M2','L4',2,'CRUD in Practice','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L5M1','L5',1,'Data Basics','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L5M2','L5',2,'Accounts & Security','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L6M1','L6',1,'LLM APIs','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L6M2','L6',2,'Production AI Features','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L7M1','L7',1,'Automation Foundations','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L7M2','L7',2,'Real-World Automations','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L8M1','L8',1,'Agent Architecture','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L8M2','L8',2,'Reliable Agents','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L9M1','L9',1,'Plan the System','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L9M2','L9',2,'Build & Harden','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L10M1','L10',1,'From Idea to Plan','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
INSERT INTO modules(id,level_id,idx,title,summary) VALUES ('L10M2','L10',2,'Ship Your MVP','') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title;
CREATE TABLE IF NOT EXISTS lesson_blocks(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lesson_id text REFERENCES lessons(id) ON DELETE CASCADE, type text, body text, language text, url text, caption text, idx int);
CREATE TABLE IF NOT EXISTS tools(id text PRIMARY KEY, name text, category text, what text, price text, why text, install text, steps jsonb, url text, website text, related_lessons jsonb);
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M1L1','L1M1',1,'What is AI?','AI predicts the next step from examples. You describe, it drafts; you check.','https://cdn.aimasterplan.app/intro/what-is-ai.mp4',12,'beginner','[{"lesson_id": "L1M1L1", "type": "heading", "body": "What is AI? — plain words", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L1M1L1", "type": "text", "body": "AI predicts the next step from examples. You describe, it drafts; you check.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L1M1L1", "type": "video", "body": "https://cdn.aimasterplan.app/intro/what-is-ai.mp4", "language": null, "url": "https://cdn.aimasterplan.app/intro/what-is-ai.mp4", "caption": "Watch: AI in 5 minutes", "order": 3}, {"lesson_id": "L1M1L1", "type": "code", "body": "console.log(''Hello, AI builder'');", "language": "javascript", "url": null, "caption": null, "order": 4}, {"lesson_id": "L1M1L1", "type": "terminal", "body": "node --version\nnpm --version", "language": null, "url": null, "caption": null, "order": 5}, {"lesson_id": "L1M1L1", "type": "prompt", "body": "GOAL: explain AI simply\nCONTEXT: total beginner\nCONSTRAINTS: no jargon\nEXAMPLE: like explaining to a friend", "language": null, "url": null, "caption": null, "order": 6}]','["GOAL: explain AI simply\nCONTEXT: total beginner\nCONSTRAINTS: no jargon\nEXAMPLE: like explaining to a friend"]','["node --version\nnpm --version"]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M1L2','L1M1',2,'What is an LLM?','Lesson: What is an LLM?

Add content using the lesson editor.','',15,'beginner','[{"lesson_id": "L1M1L2", "type": "text", "body": "Lesson: What is an LLM?\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M1L3','L1M1',3,'What is Vibe Coding?','Vibe Coding means describing what you want in plain words and letting an AI coding agent write the code.

Your job: describe clearly, run it, check the result, ask for fixes.
The agent''s job: type, remember syntax, repeat forever without getting tired.','',15,'beginner','[{"lesson_id": "L1M1L3", "type": "heading", "body": "Vibe Coding: you direct, the AI types", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L1M1L3", "type": "text", "body": "Vibe Coding means describing what you want in plain words and letting an AI coding agent write the code.\n\nYour job: describe clearly, run it, check the result, ask for fixes.\nThe agent''s job: type, remember syntax, repeat forever without getting tired.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L1M1L3", "type": "prompt", "body": "GOAL: get the agent to build [one small thing]\nCONTEXT: I have never coded; my files are [list them]\nCONSTRAINTS: change as little as possible, explain each step\nEXAMPLE: ''Add a welcome message at the top of the page''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L1M1L3", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: get the agent to build [one small thing]\nCONTEXT: I have never coded; my files are [list them]\nCONSTRAINTS: change as little as possible, explain each step\nEXAMPLE: ''Add a welcome message at the top of the page''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M1L4','L1M1',4,'AI vs Traditional Programming','Lesson: AI vs Traditional Programming

Add content using the lesson editor.','',14,'beginner','[{"lesson_id": "L1M1L4", "type": "text", "body": "Lesson: AI vs Traditional Programming\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M1L5','L1M1',5,'Understanding Prompts','GOAL: what done looks like.
CONTEXT: your files, errors, what you tried.
CONSTRAINTS: limits (small change, no new tools).
EXAMPLE: paste what ''done'' looks like.

Weak: ''fix it''. Strong: GOAL + CONTEXT + CONSTRAINTS + EXAMPLE.','',16,'beginner','[{"lesson_id": "L1M1L5", "type": "heading", "body": "Good prompts have 4 parts", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L1M1L5", "type": "text", "body": "GOAL: what done looks like.\nCONTEXT: your files, errors, what you tried.\nCONSTRAINTS: limits (small change, no new tools).\nEXAMPLE: paste what ''done'' looks like.\n\nWeak: ''fix it''. Strong: GOAL + CONTEXT + CONSTRAINTS + EXAMPLE.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L1M1L5", "type": "prompt", "body": "GOAL: [one sentence]\nCONTEXT: [file + what you did + exact error]\nCONSTRAINTS: [smallest change, explain why]\nEXAMPLE OF DONE: [paste]", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L1M1L5", "type": "quiz", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: [one sentence]\nCONTEXT: [file + what you did + exact error]\nCONSTRAINTS: [smallest change, explain why]\nEXAMPLE OF DONE: [paste]"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M2L1','L1M2',1,'Understanding Context','Lesson: Understanding Context

Add content using the lesson editor.','',14,'beginner','[{"lesson_id": "L1M2L1", "type": "text", "body": "Lesson: Understanding Context\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M2L2','L1M2',2,'Files and Folders','A project is a folder of files.

- index.html = the page.
- styles.css = how it looks.
- app.js = what it does.
- server.js = the kitchen.
- data/ = the pantry.

The full name from the project root (like public/app.js) is the file''s address. Share it when asking for help.','',14,'beginner','[{"lesson_id": "L1M2L2", "type": "heading", "body": "Files live in folders; names are addresses", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L1M2L2", "type": "text", "body": "A project is a folder of files.\n\n- index.html = the page.\n- styles.css = how it looks.\n- app.js = what it does.\n- server.js = the kitchen.\n- data/ = the pantry.\n\nThe full name from the project root (like public/app.js) is the file''s address. Share it when asking for help.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L1M2L2", "type": "terminal", "body": "ls\nls public", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L1M2L2", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','[]','["ls\nls public"]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M2L3','L1M2',3,'Basic Developer Terminology','Lesson: Basic Developer Terminology

Add content using the lesson editor.','',12,'beginner','[{"lesson_id": "L1M2L3", "type": "text", "body": "Lesson: Basic Developer Terminology\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M2L4','L1M2',4,'Understanding an Application Architecture','Every app has the same skeleton.

1. Frontend = what you see (buttons, text, pictures).
2. Backend = the kitchen (does the work when you tap).
3. Database = the pantry (remembers things).

They talk over a network: your tap travels frontend → backend → pantry and back.','',18,'beginner','[{"lesson_id": "L1M2L4", "type": "heading", "body": "Apps have 3 parts: what you see, the kitchen, the pantry", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L1M2L4", "type": "text", "body": "Every app has the same skeleton.\n\n1. Frontend = what you see (buttons, text, pictures).\n2. Backend = the kitchen (does the work when you tap).\n3. Database = the pantry (remembers things).\n\nThey talk over a network: your tap travels frontend → backend → pantry and back.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L1M2L4", "type": "prompt", "body": "GOAL: explain my app idea in 3 parts\nCONTEXT: total beginner, my idea is [describe it]\nCONSTRAINTS: plain words, no jargon\nEXAMPLE: ''Frontend shows a list, backend saves it, database remembers it''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L1M2L4", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}, {"lesson_id": "L1M2L4", "type": "quiz", "body": "", "language": null, "url": null, "caption": null, "order": 5}]','["GOAL: explain my app idea in 3 parts\nCONTEXT: total beginner, my idea is [describe it]\nCONSTRAINTS: plain words, no jargon\nEXAMPLE: ''Frontend shows a list, backend saves it, database remembers it''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L1M2L5','L1M2',5,'First AI Coding Exercise','Lesson: First AI Coding Exercise

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L1M2L5", "type": "text", "body": "Lesson: First AI Coding Exercise\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M1L1','L2M1',1,'Installing Required Tools','Lesson: Installing Required Tools

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L2M1L1", "type": "text", "body": "Lesson: Installing Required Tools\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M1L2','L2M1',2,'IDE / Code Editor Introduction','Lesson: IDE / Code Editor Introduction

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L2M1L2", "type": "text", "body": "Lesson: IDE / Code Editor Introduction\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M1L3','L2M1',3,'Git Basics','Lesson: Git Basics

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L2M1L3", "type": "text", "body": "Lesson: Git Basics\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M1L4','L2M1',4,'GitHub Account Setup','Lesson: GitHub Account Setup

Add content using the lesson editor.','',15,'beginner','[{"lesson_id": "L2M1L4", "type": "text", "body": "Lesson: GitHub Account Setup\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M1L5','L2M1',5,'Node.js Installation','Lesson: Node.js Installation

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L2M1L5", "type": "text", "body": "Lesson: Node.js Installation\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M2L1','L2M2',1,'Terminal Basics','Lesson: Terminal Basics

Add content using the lesson editor.','',15,'beginner','[{"lesson_id": "L2M2L1", "type": "text", "body": "Lesson: Terminal Basics\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M2L2','L2M2',2,'Package Managers','Lesson: Package Managers

Add content using the lesson editor.','',14,'beginner','[{"lesson_id": "L2M2L2", "type": "text", "body": "Lesson: Package Managers\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M2L3','L2M2',3,'Environment Variables','Lesson: Environment Variables

Add content using the lesson editor.','',14,'beginner','[{"lesson_id": "L2M2L3", "type": "text", "body": "Lesson: Environment Variables\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M2L4','L2M2',4,'Project Folders','Lesson: Project Folders

Add content using the lesson editor.','',12,'beginner','[{"lesson_id": "L2M2L4", "type": "text", "body": "Lesson: Project Folders\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L2M2L5','L2M2',5,'Running a Local Development Server','Running locally means starting the app on your own computer.

1. Open the terminal.
2. Move into the project folder.
3. Run the start command.
4. Open the address it prints (usually http://localhost:8082).

To modify: change one file, save, refresh.','',18,'beginner','[{"lesson_id": "L2M2L5", "type": "heading", "body": "Run it: terminal → folder → one command", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L2M2L5", "type": "text", "body": "Running locally means starting the app on your own computer.\n\n1. Open the terminal.\n2. Move into the project folder.\n3. Run the start command.\n4. Open the address it prints (usually http://localhost:8082).\n\nTo modify: change one file, save, refresh.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L2M2L5", "type": "terminal", "body": "cd my-project\nnode server.js", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L2M2L5", "type": "prompt", "body": "GOAL: run this project and show me the address\nCONTEXT: I am in [folder], I see [files]\nCONSTRAINTS: tell me exactly what to type, nothing else\nEXAMPLE: ''type this, then open this link''", "language": null, "url": null, "caption": null, "order": 4}, {"lesson_id": "L2M2L5", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 5}]','["GOAL: run this project and show me the address\nCONTEXT: I am in [folder], I see [files]\nCONSTRAINTS: tell me exactly what to type, nothing else\nEXAMPLE: ''type this, then open this link''"]','["cd my-project\nnode server.js"]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M1L1','L3M1',1,'Generate Initial Project','Describe the site in words, generate the first version, then style it, add pages/links, debug, and publish to a real link.
Keep 3 pages max for your first site. Test on your phone before sharing.','',20,'beginner','[{"lesson_id": "L3M1L1", "type": "heading", "body": "Websites: generate → style → navigate → debug → publish", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L3M1L1", "type": "text", "body": "Describe the site in words, generate the first version, then style it, add pages/links, debug, and publish to a real link.\nKeep 3 pages max for your first site. Test on your phone before sharing.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L3M1L1", "type": "prompt", "body": "GOAL: build a [3-page site about X]\nCONTEXT: beginner, pages are [list]\nCONSTRAINTS: responsive, one contact form, no new tools\nEXAMPLE: ''hero + features + contact, mobile-friendly''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L3M1L1", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: build a [3-page site about X]\nCONTEXT: beginner, pages are [list]\nCONSTRAINTS: responsive, one contact form, no new tools\nEXAMPLE: ''hero + features + contact, mobile-friendly''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M1L2','L3M1',2,'HTML Concepts','Lesson: HTML Concepts

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L3M1L2", "type": "text", "body": "Lesson: HTML Concepts\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M1L3','L3M1',3,'CSS Concepts','Lesson: CSS Concepts

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L3M1L3", "type": "text", "body": "Lesson: CSS Concepts\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M1L4','L3M1',4,'JavaScript Concepts','Lesson: JavaScript Concepts

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L3M1L4", "type": "text", "body": "Lesson: JavaScript Concepts\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M1L5','L3M1',5,'Components','Lesson: Components

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L3M1L5", "type": "text", "body": "Lesson: Components\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M2L1','L3M2',1,'Responsive Layouts','Lesson: Responsive Layouts

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L3M2L1", "type": "text", "body": "Lesson: Responsive Layouts\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M2L2','L3M2',2,'Navigation','Lesson: Navigation

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L3M2L2", "type": "text", "body": "Lesson: Navigation\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M2L3','L3M2',3,'Forms','Lesson: Forms

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L3M2L3", "type": "text", "body": "Lesson: Forms\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M2L4','L3M2',4,'Images and Assets','Lesson: Images and Assets

Add content using the lesson editor.','',14,'beginner','[{"lesson_id": "L3M2L4", "type": "text", "body": "Lesson: Images and Assets\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M2L5','L3M2',5,'Debugging','1. Read the EXACT message (copy it, don''t summarize).
2. Compare expected vs actual: what should you see vs what do you see?
3. Re-run only the LAST step, then report what changed.

90% of beginner bugs: wrong folder, server not running, or a typo in a name.','',18,'beginner','[{"lesson_id": "L3M2L5", "type": "heading", "body": "Debug in 3 steps: message → compare → last step", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L3M2L5", "type": "text", "body": "1. Read the EXACT message (copy it, don''t summarize).\n2. Compare expected vs actual: what should you see vs what do you see?\n3. Re-run only the LAST step, then report what changed.\n\n90% of beginner bugs: wrong folder, server not running, or a typo in a name.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L3M2L5", "type": "prompt", "body": "GOAL: fix this error\nCONTEXT: lesson [id], I did [steps], I expected [x] but saw [y], exact message: [paste]\nCONSTRAINTS: one fix at a time\nEXAMPLE: ''tell me which of the 3 steps failed''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L3M2L5", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: fix this error\nCONTEXT: lesson [id], I did [steps], I expected [x] but saw [y], exact message: [paste]\nCONSTRAINTS: one fix at a time\nEXAMPLE: ''tell me which of the 3 steps failed''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L3M2L6','L3M2',6,'Build a Complete Website','Lesson: Build a Complete Website

Add content using the lesson editor.','',30,'beginner','[{"lesson_id": "L3M2L6", "type": "text", "body": "Lesson: Build a Complete Website\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M1L1','L4M1',1,'Understand Frontend','Lesson: Understand Frontend

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L4M1L1", "type": "text", "body": "Lesson: Understand Frontend\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M1L2','L4M1',2,'Understand Backend','Lesson: Understand Backend

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L4M1L2", "type": "text", "body": "Lesson: Understand Backend\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M1L3','L4M1',3,'Understand Client/Server Communication','Lesson: Understand Client/Server Communication

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L4M1L3", "type": "text", "body": "Lesson: Understand Client/Server Communication\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M1L4','L4M1',4,'APIs','An API is a menu: you order (request) and get a dish (JSON response).

GET /api/tools = ''show me tools''. POST with JSON = ''take this order''.
Keys stay on the server (in .env), never in the page. Open the browser Network tab to watch orders go out.','',20,'beginner','[{"lesson_id": "L4M1L4", "type": "heading", "body": "APIs are menus for software", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L4M1L4", "type": "text", "body": "An API is a menu: you order (request) and get a dish (JSON response).\n\nGET /api/tools = ''show me tools''. POST with JSON = ''take this order''.\nKeys stay on the server (in .env), never in the page. Open the browser Network tab to watch orders go out.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L4M1L4", "type": "code", "body": "// APIs return JSON. Try it in your browser console against the live API:\n//   const r = await fetch(''/api/tools'');\n//   console.log((await r.json()).tools.length);\nconst tools = { tools: [{ name: ''Git'' }, { name: ''VS Code'' }] };\nconsole.log(''tools:'', tools.tools.length);\nconsole.log(''first:'', tools.tools[0].name);", "language": "javascript", "url": null, "caption": null, "order": 3}, {"lesson_id": "L4M1L4", "type": "prompt", "body": "GOAL: call [API name] and show [what]\nCONTEXT: my code is [paste], the docs say [paste]\nCONSTRAINTS: keep my key server-side\nEXAMPLE: ''fetch the list and print the first item''", "language": null, "url": null, "caption": null, "order": 4}, {"lesson_id": "L4M1L4", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 5}]','["GOAL: call [API name] and show [what]\nCONTEXT: my code is [paste], the docs say [paste]\nCONSTRAINTS: keep my key server-side\nEXAMPLE: ''fetch the list and print the first item''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M1L5','L4M1',5,'JSON','Lesson: JSON

Add content using the lesson editor.','',14,'beginner','[{"lesson_id": "L4M1L5", "type": "text", "body": "Lesson: JSON\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M1L6','L4M1',6,'REST','Lesson: REST

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L4M1L6", "type": "text", "body": "Lesson: REST\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M2L1','L4M2',1,'Form Submission','Lesson: Form Submission

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L4M2L1", "type": "text", "body": "Lesson: Form Submission\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M2L2','L4M2',2,'Data Persistence','Lesson: Data Persistence

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L4M2L2", "type": "text", "body": "Lesson: Data Persistence\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L4M2L3','L4M2',3,'Error Handling + Functional CRUD Application','Lesson: Error Handling + Functional CRUD Application

Add content using the lesson editor.','',32,'beginner','[{"lesson_id": "L4M2L3", "type": "text", "body": "Lesson: Error Handling + Functional CRUD Application\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M1L1','L5M1',1,'Database Basics','A database is a pantry of tables. Each table holds rows (like spreadsheet rows).

You do 5 things: create, read, update, delete, query (find).
CRUD = the first four. Start by reading one row before writing any.','',16,'beginner','[{"lesson_id": "L5M1L1", "type": "heading", "body": "Databases remember rows", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L5M1L1", "type": "text", "body": "A database is a pantry of tables. Each table holds rows (like spreadsheet rows).\n\nYou do 5 things: create, read, update, delete, query (find).\nCRUD = the first four. Start by reading one row before writing any.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L5M1L1", "type": "code", "body": "// read all students (admin)\nconst r = await fetch(''/api/cms/students'', { headers: { Authorization: ''Bearer '' + token } });", "language": "javascript", "url": null, "caption": null, "order": 3}, {"lesson_id": "L5M1L1", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M1L2','L5M1',2,'Tables and Collections','Lesson: Tables and Collections

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L5M1L2", "type": "text", "body": "Lesson: Tables and Collections\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M1L3','L5M1',3,'Creating Records','Lesson: Creating Records

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L5M1L3", "type": "text", "body": "Lesson: Creating Records\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M1L4','L5M1',4,'Updating Records','Lesson: Updating Records

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L5M1L4", "type": "text", "body": "Lesson: Updating Records\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M1L5','L5M1',5,'Deleting Records','Lesson: Deleting Records

Add content using the lesson editor.','',14,'beginner','[{"lesson_id": "L5M1L5", "type": "text", "body": "Lesson: Deleting Records\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M1L6','L5M1',6,'Querying Data','Lesson: Querying Data

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L5M1L6", "type": "text", "body": "Lesson: Querying Data\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M2L1','L5M2',1,'Authentication','Sign-in proves identity (email + password → session token).
The token rides in the Authorization header on every private request.
Roles (student/instructor/author/admin) decide what each token may touch.
Passwords are salted hashes — the server never stores the real one.','',25,'beginner','[{"lesson_id": "L5M2L1", "type": "heading", "body": "Authentication = who are you? Authorization = may you?", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L5M2L1", "type": "text", "body": "Sign-in proves identity (email + password → session token).\nThe token rides in the Authorization header on every private request.\nRoles (student/instructor/author/admin) decide what each token may touch.\nPasswords are salted hashes — the server never stores the real one.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L5M2L1", "type": "code", "body": "await fetch(''/api/lesson-progress'', {\n  method: ''POST'',\n  headers: { ''Content-Type'': ''application/json'', Authorization: ''Bearer '' + token },\n  body: JSON.stringify({ lessonId: ''L1M1L1'', completed: true })\n});", "language": "javascript", "url": null, "caption": null, "order": 3}, {"lesson_id": "L5M2L1", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M2L2','L5M2',2,'Authorization','Lesson: Authorization

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L5M2L2", "type": "text", "body": "Lesson: Authorization\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M2L3','L5M2',3,'User Sessions','Lesson: User Sessions

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L5M2L3", "type": "text", "body": "Lesson: User Sessions\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M2L4','L5M2',4,'User Profiles','Lesson: User Profiles

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L5M2L4", "type": "text", "body": "Lesson: User Profiles\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L5M2L5','L5M2',5,'Secure Environment Variables + Multi-User App','Lesson: Secure Environment Variables + Multi-User App

Add content using the lesson editor.','',30,'beginner','[{"lesson_id": "L5M2L5", "type": "text", "body": "Lesson: Secure Environment Variables + Multi-User App\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M1L1','L6M1',1,'AI APIs','The page sends your words to YOUR server. Your server adds the secret key and asks the AI model. The answer comes back through your server.

Keys live in server .env only. Set spending caps. Stream long answers so the page feels alive.','',20,'beginner','[{"lesson_id": "L6M1L1", "type": "heading", "body": "AI APIs: your server asks the model, the page never holds the key", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L6M1L1", "type": "text", "body": "The page sends your words to YOUR server. Your server adds the secret key and asks the AI model. The answer comes back through your server.\n\nKeys live in server .env only. Set spending caps. Stream long answers so the page feels alive.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L6M1L1", "type": "prompt", "body": "GOAL: add an AI reply to [feature]\nCONTEXT: my server file is [paste], key is in .env\nCONSTRAINTS: key never in client code, cap length\nEXAMPLE: ''user asks X, assistant answers in 2 sentences''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L6M1L1", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: add an AI reply to [feature]\nCONTEXT: my server file is [paste], key is in .env\nCONSTRAINTS: key never in client code, cap length\nEXAMPLE: ''user asks X, assistant answers in 2 sentences''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M1L2','L6M1',2,'LLM API Concepts','Lesson: LLM API Concepts

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L6M1L2", "type": "text", "body": "Lesson: LLM API Concepts\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M1L3','L6M1',3,'System Prompts','Lesson: System Prompts

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L6M1L3", "type": "text", "body": "Lesson: System Prompts\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M1L4','L6M1',4,'User Prompts','Lesson: User Prompts

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L6M1L4", "type": "text", "body": "Lesson: User Prompts\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M1L5','L6M1',5,'Context Management','Lesson: Context Management

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L6M1L5", "type": "text", "body": "Lesson: Context Management\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M2L1','L6M2',1,'Structured Output','Lesson: Structured Output

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L6M2L1", "type": "text", "body": "Lesson: Structured Output\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M2L2','L6M2',2,'Tool and Function Calling','Lesson: Tool and Function Calling

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L6M2L2", "type": "text", "body": "Lesson: Tool and Function Calling\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M2L3','L6M2',3,'Streaming Responses','Lesson: Streaming Responses

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L6M2L3", "type": "text", "body": "Lesson: Streaming Responses\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M2L4','L6M2',4,'Error Handling','Lesson: Error Handling

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L6M2L4", "type": "text", "body": "Lesson: Error Handling\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L6M2L5','L6M2',5,'Usage and Cost Awareness + Assistant App','Lesson: Usage and Cost Awareness + Assistant App

Add content using the lesson editor.','',30,'beginner','[{"lesson_id": "L6M2L5", "type": "text", "body": "Lesson: Usage and Cost Awareness + Assistant App\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M1L1','L7M1',1,'Automation Fundamentals','Every automation: something happens (trigger) → AI decides → something gets done (action).
Money moves only after a human approves.
Start with a dry-run switch: log what WOULD happen before touching real data.','',20,'beginner','[{"lesson_id": "L7M1L1", "type": "heading", "body": "Automations: trigger → AI step → action (+ human approval)", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L7M1L1", "type": "text", "body": "Every automation: something happens (trigger) → AI decides → something gets done (action).\nMoney moves only after a human approves.\nStart with a dry-run switch: log what WOULD happen before touching real data.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L7M1L1", "type": "prompt", "body": "GOAL: automate [task]\nCONTEXT: trigger is [event], data looks like [paste]\nCONSTRAINTS: dry-run first, approval before sending\nEXAMPLE: ''new row → AI drafts reply → I approve → send''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L7M1L1", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: automate [task]\nCONTEXT: trigger is [event], data looks like [paste]\nCONSTRAINTS: dry-run first, approval before sending\nEXAMPLE: ''new row → AI drafts reply → I approve → send''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M1L2','L7M1',2,'Triggers','Lesson: Triggers

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L7M1L2", "type": "text", "body": "Lesson: Triggers\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M1L3','L7M1',3,'Actions','Lesson: Actions

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L7M1L3", "type": "text", "body": "Lesson: Actions\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M1L4','L7M1',4,'Webhooks','Lesson: Webhooks

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L7M1L4", "type": "text", "body": "Lesson: Webhooks\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M1L5','L7M1',5,'APIs for Automation','Lesson: APIs for Automation

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L7M1L5", "type": "text", "body": "Lesson: APIs for Automation\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M1L6','L7M1',6,'Scheduled Workflows','Lesson: Scheduled Workflows

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L7M1L6", "type": "text", "body": "Lesson: Scheduled Workflows\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M2L1','L7M2',1,'Data Processing','Lesson: Data Processing

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L7M2L1", "type": "text", "body": "Lesson: Data Processing\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M2L2','L7M2',2,'Email Automation','Lesson: Email Automation

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L7M2L2", "type": "text", "body": "Lesson: Email Automation\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M2L3','L7M2',3,'CRM Automation','Lesson: CRM Automation

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L7M2L3", "type": "text", "body": "Lesson: CRM Automation\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M2L4','L7M2',4,'Social Automation','Lesson: Social Automation

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L7M2L4", "type": "text", "body": "Lesson: Social Automation\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M2L5','L7M2',5,'AI Decision Steps','Lesson: AI Decision Steps

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L7M2L5", "type": "text", "body": "Lesson: AI Decision Steps\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L7M2L6','L7M2',6,'Human Approval Workflows + Real Automation','Lesson: Human Approval Workflows + Real Automation

Add content using the lesson editor.','',30,'beginner','[{"lesson_id": "L7M2L6", "type": "text", "body": "Lesson: Human Approval Workflows + Real Automation\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M1L1','L8M1',1,'What is an AI Agent?','An agent plans steps, uses ONLY approved tools, checks its own work (verifier), and remembers (memory).
Safety first: allowlist 2 tools, run in a sandbox, log every step, require approval for anything irreversible.','',20,'beginner','[{"lesson_id": "L8M1L1", "type": "heading", "body": "Agents: planner + allowlisted tools + verifier + memory", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L8M1L1", "type": "text", "body": "An agent plans steps, uses ONLY approved tools, checks its own work (verifier), and remembers (memory).\nSafety first: allowlist 2 tools, run in a sandbox, log every step, require approval for anything irreversible.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L8M1L1", "type": "prompt", "body": "GOAL: do [multi-step task]\nCONTEXT: allowed tools are [tool1, tool2], stop when [done looks like]\nCONSTRAINTS: use only allowlisted tools, show the plan first\nEXAMPLE: ''plan 3 steps, then run step 1''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L8M1L1", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: do [multi-step task]\nCONTEXT: allowed tools are [tool1, tool2], stop when [done looks like]\nCONSTRAINTS: use only allowlisted tools, show the plan first\nEXAMPLE: ''plan 3 steps, then run step 1''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M1L2','L8M1',2,'Agent Architecture','Lesson: Agent Architecture

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L8M1L2", "type": "text", "body": "Lesson: Agent Architecture\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M1L3','L8M1',3,'Tools','Lesson: Tools

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L8M1L3", "type": "text", "body": "Lesson: Tools\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M1L4','L8M1',4,'Memory','Lesson: Memory

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L8M1L4", "type": "text", "body": "Lesson: Memory\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M1L5','L8M1',5,'Planning','Lesson: Planning

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L8M1L5", "type": "text", "body": "Lesson: Planning\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M2L1','L8M2',1,'Execution','Lesson: Execution

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L8M2L1", "type": "text", "body": "Lesson: Execution\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M2L2','L8M2',2,'Verification','Lesson: Verification

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L8M2L2", "type": "text", "body": "Lesson: Verification\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M2L3','L8M2',3,'Multi-Step Tasks','Lesson: Multi-Step Tasks

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L8M2L3", "type": "text", "body": "Lesson: Multi-Step Tasks\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M2L4','L8M2',4,'Agent Safety and Permissions','Lesson: Agent Safety and Permissions

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L8M2L4", "type": "text", "body": "Lesson: Agent Safety and Permissions\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L8M2L5','L8M2',5,'Multi-Agent Workflows + Task Agent','Lesson: Multi-Agent Workflows + Task Agent

Add content using the lesson editor.','',32,'beginner','[{"lesson_id": "L8M2L5", "type": "text", "body": "Lesson: Multi-Agent Workflows + Task Agent\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M1L1','L9M1',1,'Product Requirements','Lesson: Product Requirements

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L9M1L1", "type": "text", "body": "Lesson: Product Requirements\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M1L2','L9M1',2,'System Architecture','Lesson: System Architecture

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L9M1L2", "type": "text", "body": "Lesson: System Architecture\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M1L3','L9M1',3,'Frontend Build','Your backend API serves BOTH faces.

- Web face: HTML/CSS/JS pages.
- Mobile face: Expo (runs on iOS + Android from one codebase). Screens call the SAME /api endpoints with the user''s token.

Build web first, then add 3 Expo screens (list, detail, profile) + auth + push. Ship phones via EAS → TestFlight/Play internal.','',25,'beginner','[{"lesson_id": "L9M1L3", "type": "heading", "body": "Frontend + mobile: same API, two faces (web + Expo phone app)", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L9M1L3", "type": "text", "body": "Your backend API serves BOTH faces.\n\n- Web face: HTML/CSS/JS pages.\n- Mobile face: Expo (runs on iOS + Android from one codebase). Screens call the SAME /api endpoints with the user''s token.\n\nBuild web first, then add 3 Expo screens (list, detail, profile) + auth + push. Ship phones via EAS → TestFlight/Play internal.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L9M1L3", "type": "terminal", "body": "npx create-expo-app my-app\ncd my-app\nnpx expo start", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L9M1L3", "type": "prompt", "body": "GOAL: add a mobile screen for [feature]\nCONTEXT: API is [endpoint], token auth, Expo managed workflow\nCONSTRAINTS: reuse the same API, no keys in client\nEXAMPLE: ''list screen fetching /api/projects with token''", "language": null, "url": null, "caption": null, "order": 4}, {"lesson_id": "L9M1L3", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 5}]','["GOAL: add a mobile screen for [feature]\nCONTEXT: API is [endpoint], token auth, Expo managed workflow\nCONSTRAINTS: reuse the same API, no keys in client\nEXAMPLE: ''list screen fetching /api/projects with token''"]','["npx create-expo-app my-app\ncd my-app\nnpx expo start"]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M1L4','L9M1',4,'Backend Build','Lesson: Backend Build

Add content using the lesson editor.','',25,'beginner','[{"lesson_id": "L9M1L4", "type": "text", "body": "Lesson: Backend Build\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M1L5','L9M1',5,'Database Build','Lesson: Database Build

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L9M1L5", "type": "text", "body": "Lesson: Database Build\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M1L6','L9M1',6,'Authentication Build','Lesson: Authentication Build

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L9M1L6", "type": "text", "body": "Lesson: Authentication Build\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M1L7','L9M1',7,'AI Integration Build','Lesson: AI Integration Build

Add content using the lesson editor.','',28,'beginner','[{"lesson_id": "L9M1L7", "type": "text", "body": "Lesson: AI Integration Build\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L1','L9M2',1,'Agent Workflows','Lesson: Agent Workflows

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L9M2L1", "type": "text", "body": "Lesson: Agent Workflows\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L2','L9M2',2,'File Handling','Lesson: File Handling

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L9M2L2", "type": "text", "body": "Lesson: File Handling\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L3','L9M2',3,'Notifications','Lesson: Notifications

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L9M2L3", "type": "text", "body": "Lesson: Notifications\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L4','L9M2',4,'Logging','Lesson: Logging

Add content using the lesson editor.','',16,'beginner','[{"lesson_id": "L9M2L4", "type": "text", "body": "Lesson: Logging\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L5','L9M2',5,'Error Handling','Lesson: Error Handling

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L9M2L5", "type": "text", "body": "Lesson: Error Handling\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L6','L9M2',6,'Testing','1. Click through as a user (happy path + one mistake).
2. Add automated checks: one per feature (200 OK? correct text?).
3. Run the full suite before every deploy: `npm test`.
Green suite = permission to ship.','',22,'beginner','[{"lesson_id": "L9M2L6", "type": "heading", "body": "Test like a user, then like a machine", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L9M2L6", "type": "text", "body": "1. Click through as a user (happy path + one mistake).\n2. Add automated checks: one per feature (200 OK? correct text?).\n3. Run the full suite before every deploy: `npm test`.\nGreen suite = permission to ship.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L9M2L6", "type": "terminal", "body": "npm test", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L9M2L6", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','[]','["npm test"]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L7','L9M2',7,'Security','Lesson: Security

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L9M2L7", "type": "text", "body": "Lesson: Security\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L9M2L8','L9M2',8,'Performance + SaaS Launch','Lesson: Performance + SaaS Launch

Add content using the lesson editor.','',30,'beginner','[{"lesson_id": "L9M2L8", "type": "text", "body": "Lesson: Performance + SaaS Launch\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M1L1','L10M1',1,'Turn an Idea into Requirements','One page is enough:
Problem (1 line) → Users → Must-have features (≤7) → Stack → Architecture (1 sketch) → Tasks in order → Deploy plan.
Then paste it into the Project Planner to generate todos and track them.','',25,'beginner','[{"lesson_id": "L10M1L1", "type": "heading", "body": "Ideas become PRDs: problem → users → features → stack → tasks", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L10M1L1", "type": "text", "body": "One page is enough:\nProblem (1 line) → Users → Must-have features (≤7) → Stack → Architecture (1 sketch) → Tasks in order → Deploy plan.\nThen paste it into the Project Planner to generate todos and track them.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L10M1L1", "type": "prompt", "body": "GOAL: turn my idea into a 1-page PRD\nCONTEXT: idea is [one paragraph], users are [who]\nCONSTRAINTS: max 7 features, smallest stack that works\nEXAMPLE: ''problem, users, features, stack, tasks''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L10M1L1", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: turn my idea into a 1-page PRD\nCONTEXT: idea is [one paragraph], users are [who]\nCONSTRAINTS: max 7 features, smallest stack that works\nEXAMPLE: ''problem, users, features, stack, tasks''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M1L2','L10M1',2,'Create PRD','Lesson: Create PRD

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L10M1L2", "type": "text", "body": "Lesson: Create PRD\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M1L3','L10M1',3,'Define Features','Lesson: Define Features

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L10M1L3", "type": "text", "body": "Lesson: Define Features\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M1L4','L10M1',4,'Design Architecture','Lesson: Design Architecture

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L10M1L4", "type": "text", "body": "Lesson: Design Architecture\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M1L5','L10M1',5,'Choose Technologies','Lesson: Choose Technologies

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L10M1L5", "type": "text", "body": "Lesson: Choose Technologies\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M1L6','L10M1',6,'Break Project into Tasks','Lesson: Break Project into Tasks

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L10M1L6", "type": "text", "body": "Lesson: Break Project into Tasks\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M2L1','L10M2',1,'Prompt AI Coding Agents Effectively','Lesson: Prompt AI Coding Agents Effectively

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L10M2L1", "type": "text", "body": "Lesson: Prompt AI Coding Agents Effectively\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M2L2','L10M2',2,'Review Generated Code','Lesson: Review Generated Code

Add content using the lesson editor.','',20,'beginner','[{"lesson_id": "L10M2L2", "type": "text", "body": "Lesson: Review Generated Code\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M2L3','L10M2',3,'Debug Independently','Lesson: Debug Independently

Add content using the lesson editor.','',25,'beginner','[{"lesson_id": "L10M2L3", "type": "text", "body": "Lesson: Debug Independently\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M2L4','L10M2',4,'Test Application','Lesson: Test Application

Add content using the lesson editor.','',22,'beginner','[{"lesson_id": "L10M2L4", "type": "text", "body": "Lesson: Test Application\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M2L5','L10M2',5,'Deploy Application','1. Full tests green.
2. Backup data.
3. Ship to an internal link, click everything.
4. Ship production, then watch /api/health + /api/metrics for 15 minutes.
Keep the last backup until the new version proves itself.','',25,'beginner','[{"lesson_id": "L10M2L5", "type": "heading", "body": "Deploy: test → internal → production + watch", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L10M2L5", "type": "text", "body": "1. Full tests green.\n2. Backup data.\n3. Ship to an internal link, click everything.\n4. Ship production, then watch /api/health + /api/metrics for 15 minutes.\nKeep the last backup until the new version proves itself.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L10M2L5", "type": "terminal", "body": "sh deploy/backup.sh\nsh deploy/healthcheck.sh", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L10M2L5", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','[]','["sh deploy/backup.sh\nsh deploy/healthcheck.sh"]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M2L6','L10M2',6,'Maintain Application','Lesson: Maintain Application

Add content using the lesson editor.','',18,'beginner','[{"lesson_id": "L10M2L6", "type": "text", "body": "Lesson: Maintain Application\n\nAdd content using the lesson editor.", "language": null, "url": null, "caption": null, "order": 1}]','[]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lessons(id,module_id,idx,title,objective,video_url,minutes,difficulty,steps,prompts,commands,resources,troubleshooting) VALUES ('L10M2L7','L10M2',7,'Improve + Present Your Product','Cut everything except the ONE workflow that proves value.
Slice: auth → core CRUD → one AI step → test → deploy → 3-minute demo (problem, live click-through, what''s next).
Ship, watch real users, improve weekly.','',35,'beginner','[{"lesson_id": "L10M2L7", "type": "heading", "body": "MVP: smallest thing that proves it + demo day", "language": null, "url": null, "caption": null, "order": 1}, {"lesson_id": "L10M2L7", "type": "text", "body": "Cut everything except the ONE workflow that proves value.\nSlice: auth → core CRUD → one AI step → test → deploy → 3-minute demo (problem, live click-through, what''s next).\nShip, watch real users, improve weekly.", "language": null, "url": null, "caption": null, "order": 2}, {"lesson_id": "L10M2L7", "type": "prompt", "body": "GOAL: cut my PRD to an MVP slice\nCONTEXT: my PRD is [paste]\nCONSTRAINTS: 1 workflow, 2 weeks max, demoable link\nEXAMPLE: ''login → main action → done, live URL''", "language": null, "url": null, "caption": null, "order": 3}, {"lesson_id": "L10M2L7", "type": "exercise", "body": "", "language": null, "url": null, "caption": null, "order": 4}]','["GOAL: cut my PRD to an MVP slice\nCONTEXT: my PRD is [paste]\nCONSTRAINTS: 1 workflow, 2 weeks max, demoable link\nEXAMPLE: ''login → main action → done, live URL''"]','[]','[]','[]') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, video_url=EXCLUDED.video_url, steps=EXCLUDED.steps;
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L1','heading','What is AI? — plain words',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L1','text','AI predicts the next step from examples. You describe, it drafts; you check.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L1','video','https://cdn.aimasterplan.app/intro/what-is-ai.mp4',NULL,'https://cdn.aimasterplan.app/intro/what-is-ai.mp4','Watch: AI in 5 minutes',3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L1','code','console.log(''Hello, AI builder'');','javascript',NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L1','terminal','node --version
npm --version',NULL,NULL,NULL,5);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L1','prompt','GOAL: explain AI simply
CONTEXT: total beginner
CONSTRAINTS: no jargon
EXAMPLE: like explaining to a friend',NULL,NULL,NULL,6);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L2','text','Lesson: What is an LLM?

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L3','heading','Vibe Coding: you direct, the AI types',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L3','text','Vibe Coding means describing what you want in plain words and letting an AI coding agent write the code.

Your job: describe clearly, run it, check the result, ask for fixes.
The agent''s job: type, remember syntax, repeat forever without getting tired.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L3','prompt','GOAL: get the agent to build [one small thing]
CONTEXT: I have never coded; my files are [list them]
CONSTRAINTS: change as little as possible, explain each step
EXAMPLE: ''Add a welcome message at the top of the page''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L3','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L4','text','Lesson: AI vs Traditional Programming

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L5','heading','Good prompts have 4 parts',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L5','text','GOAL: what done looks like.
CONTEXT: your files, errors, what you tried.
CONSTRAINTS: limits (small change, no new tools).
EXAMPLE: paste what ''done'' looks like.

Weak: ''fix it''. Strong: GOAL + CONTEXT + CONSTRAINTS + EXAMPLE.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L5','prompt','GOAL: [one sentence]
CONTEXT: [file + what you did + exact error]
CONSTRAINTS: [smallest change, explain why]
EXAMPLE OF DONE: [paste]',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M1L5','quiz','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L1','text','Lesson: Understanding Context

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L2','heading','Files live in folders; names are addresses',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L2','text','A project is a folder of files.

- index.html = the page.
- styles.css = how it looks.
- app.js = what it does.
- server.js = the kitchen.
- data/ = the pantry.

The full name from the project root (like public/app.js) is the file''s address. Share it when asking for help.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L2','terminal','ls
ls public',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L2','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L3','text','Lesson: Basic Developer Terminology

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L4','heading','Apps have 3 parts: what you see, the kitchen, the pantry',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L4','text','Every app has the same skeleton.

1. Frontend = what you see (buttons, text, pictures).
2. Backend = the kitchen (does the work when you tap).
3. Database = the pantry (remembers things).

They talk over a network: your tap travels frontend → backend → pantry and back.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L4','prompt','GOAL: explain my app idea in 3 parts
CONTEXT: total beginner, my idea is [describe it]
CONSTRAINTS: plain words, no jargon
EXAMPLE: ''Frontend shows a list, backend saves it, database remembers it''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L4','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L4','quiz','',NULL,NULL,NULL,5);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L1M2L5','text','Lesson: First AI Coding Exercise

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M1L1','text','Lesson: Installing Required Tools

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M1L2','text','Lesson: IDE / Code Editor Introduction

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M1L3','text','Lesson: Git Basics

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M1L4','text','Lesson: GitHub Account Setup

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M1L5','text','Lesson: Node.js Installation

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L1','text','Lesson: Terminal Basics

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L2','text','Lesson: Package Managers

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L3','text','Lesson: Environment Variables

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L4','text','Lesson: Project Folders

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L5','heading','Run it: terminal → folder → one command',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L5','text','Running locally means starting the app on your own computer.

1. Open the terminal.
2. Move into the project folder.
3. Run the start command.
4. Open the address it prints (usually http://localhost:8082).

To modify: change one file, save, refresh.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L5','terminal','cd my-project
node server.js',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L5','prompt','GOAL: run this project and show me the address
CONTEXT: I am in [folder], I see [files]
CONSTRAINTS: tell me exactly what to type, nothing else
EXAMPLE: ''type this, then open this link''',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L2M2L5','exercise','',NULL,NULL,NULL,5);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L1','heading','Websites: generate → style → navigate → debug → publish',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L1','text','Describe the site in words, generate the first version, then style it, add pages/links, debug, and publish to a real link.
Keep 3 pages max for your first site. Test on your phone before sharing.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L1','prompt','GOAL: build a [3-page site about X]
CONTEXT: beginner, pages are [list]
CONSTRAINTS: responsive, one contact form, no new tools
EXAMPLE: ''hero + features + contact, mobile-friendly''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L1','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L2','text','Lesson: HTML Concepts

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L3','text','Lesson: CSS Concepts

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L4','text','Lesson: JavaScript Concepts

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M1L5','text','Lesson: Components

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L1','text','Lesson: Responsive Layouts

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L2','text','Lesson: Navigation

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L3','text','Lesson: Forms

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L4','text','Lesson: Images and Assets

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L5','heading','Debug in 3 steps: message → compare → last step',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L5','text','1. Read the EXACT message (copy it, don''t summarize).
2. Compare expected vs actual: what should you see vs what do you see?
3. Re-run only the LAST step, then report what changed.

90% of beginner bugs: wrong folder, server not running, or a typo in a name.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L5','prompt','GOAL: fix this error
CONTEXT: lesson [id], I did [steps], I expected [x] but saw [y], exact message: [paste]
CONSTRAINTS: one fix at a time
EXAMPLE: ''tell me which of the 3 steps failed''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L5','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L3M2L6','text','Lesson: Build a Complete Website

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L1','text','Lesson: Understand Frontend

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L2','text','Lesson: Understand Backend

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L3','text','Lesson: Understand Client/Server Communication

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L4','heading','APIs are menus for software',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L4','text','An API is a menu: you order (request) and get a dish (JSON response).

GET /api/tools = ''show me tools''. POST with JSON = ''take this order''.
Keys stay on the server (in .env), never in the page. Open the browser Network tab to watch orders go out.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L4','code','// APIs return JSON. Try it in your browser console against the live API:
//   const r = await fetch(''/api/tools'');
//   console.log((await r.json()).tools.length);
const tools = { tools: [{ name: ''Git'' }, { name: ''VS Code'' }] };
console.log(''tools:'', tools.tools.length);
console.log(''first:'', tools.tools[0].name);','javascript',NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L4','prompt','GOAL: call [API name] and show [what]
CONTEXT: my code is [paste], the docs say [paste]
CONSTRAINTS: keep my key server-side
EXAMPLE: ''fetch the list and print the first item''',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L4','exercise','',NULL,NULL,NULL,5);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L5','text','Lesson: JSON

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M1L6','text','Lesson: REST

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M2L1','text','Lesson: Form Submission

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M2L2','text','Lesson: Data Persistence

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L4M2L3','text','Lesson: Error Handling + Functional CRUD Application

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L1','heading','Databases remember rows',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L1','text','A database is a pantry of tables. Each table holds rows (like spreadsheet rows).

You do 5 things: create, read, update, delete, query (find).
CRUD = the first four. Start by reading one row before writing any.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L1','code','// read all students (admin)
const r = await fetch(''/api/cms/students'', { headers: { Authorization: ''Bearer '' + token } });','javascript',NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L1','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L2','text','Lesson: Tables and Collections

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L3','text','Lesson: Creating Records

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L4','text','Lesson: Updating Records

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L5','text','Lesson: Deleting Records

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M1L6','text','Lesson: Querying Data

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L1','heading','Authentication = who are you? Authorization = may you?',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L1','text','Sign-in proves identity (email + password → session token).
The token rides in the Authorization header on every private request.
Roles (student/instructor/author/admin) decide what each token may touch.
Passwords are salted hashes — the server never stores the real one.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L1','code','await fetch(''/api/lesson-progress'', {
  method: ''POST'',
  headers: { ''Content-Type'': ''application/json'', Authorization: ''Bearer '' + token },
  body: JSON.stringify({ lessonId: ''L1M1L1'', completed: true })
});','javascript',NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L1','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L2','text','Lesson: Authorization

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L3','text','Lesson: User Sessions

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L4','text','Lesson: User Profiles

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L5M2L5','text','Lesson: Secure Environment Variables + Multi-User App

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L1','heading','AI APIs: your server asks the model, the page never holds the key',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L1','text','The page sends your words to YOUR server. Your server adds the secret key and asks the AI model. The answer comes back through your server.

Keys live in server .env only. Set spending caps. Stream long answers so the page feels alive.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L1','prompt','GOAL: add an AI reply to [feature]
CONTEXT: my server file is [paste], key is in .env
CONSTRAINTS: key never in client code, cap length
EXAMPLE: ''user asks X, assistant answers in 2 sentences''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L1','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L2','text','Lesson: LLM API Concepts

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L3','text','Lesson: System Prompts

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L4','text','Lesson: User Prompts

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M1L5','text','Lesson: Context Management

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M2L1','text','Lesson: Structured Output

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M2L2','text','Lesson: Tool and Function Calling

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M2L3','text','Lesson: Streaming Responses

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M2L4','text','Lesson: Error Handling

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L6M2L5','text','Lesson: Usage and Cost Awareness + Assistant App

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L1','heading','Automations: trigger → AI step → action (+ human approval)',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L1','text','Every automation: something happens (trigger) → AI decides → something gets done (action).
Money moves only after a human approves.
Start with a dry-run switch: log what WOULD happen before touching real data.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L1','prompt','GOAL: automate [task]
CONTEXT: trigger is [event], data looks like [paste]
CONSTRAINTS: dry-run first, approval before sending
EXAMPLE: ''new row → AI drafts reply → I approve → send''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L1','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L2','text','Lesson: Triggers

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L3','text','Lesson: Actions

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L4','text','Lesson: Webhooks

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L5','text','Lesson: APIs for Automation

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M1L6','text','Lesson: Scheduled Workflows

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M2L1','text','Lesson: Data Processing

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M2L2','text','Lesson: Email Automation

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M2L3','text','Lesson: CRM Automation

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M2L4','text','Lesson: Social Automation

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M2L5','text','Lesson: AI Decision Steps

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L7M2L6','text','Lesson: Human Approval Workflows + Real Automation

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L1','heading','Agents: planner + allowlisted tools + verifier + memory',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L1','text','An agent plans steps, uses ONLY approved tools, checks its own work (verifier), and remembers (memory).
Safety first: allowlist 2 tools, run in a sandbox, log every step, require approval for anything irreversible.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L1','prompt','GOAL: do [multi-step task]
CONTEXT: allowed tools are [tool1, tool2], stop when [done looks like]
CONSTRAINTS: use only allowlisted tools, show the plan first
EXAMPLE: ''plan 3 steps, then run step 1''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L1','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L2','text','Lesson: Agent Architecture

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L3','text','Lesson: Tools

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L4','text','Lesson: Memory

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M1L5','text','Lesson: Planning

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M2L1','text','Lesson: Execution

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M2L2','text','Lesson: Verification

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M2L3','text','Lesson: Multi-Step Tasks

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M2L4','text','Lesson: Agent Safety and Permissions

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L8M2L5','text','Lesson: Multi-Agent Workflows + Task Agent

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L1','text','Lesson: Product Requirements

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L2','text','Lesson: System Architecture

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L3','heading','Frontend + mobile: same API, two faces (web + Expo phone app)',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L3','text','Your backend API serves BOTH faces.

- Web face: HTML/CSS/JS pages.
- Mobile face: Expo (runs on iOS + Android from one codebase). Screens call the SAME /api endpoints with the user''s token.

Build web first, then add 3 Expo screens (list, detail, profile) + auth + push. Ship phones via EAS → TestFlight/Play internal.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L3','terminal','npx create-expo-app my-app
cd my-app
npx expo start',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L3','prompt','GOAL: add a mobile screen for [feature]
CONTEXT: API is [endpoint], token auth, Expo managed workflow
CONSTRAINTS: reuse the same API, no keys in client
EXAMPLE: ''list screen fetching /api/projects with token''',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L3','exercise','',NULL,NULL,NULL,5);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L4','text','Lesson: Backend Build

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L5','text','Lesson: Database Build

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L6','text','Lesson: Authentication Build

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M1L7','text','Lesson: AI Integration Build

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L1','text','Lesson: Agent Workflows

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L2','text','Lesson: File Handling

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L3','text','Lesson: Notifications

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L4','text','Lesson: Logging

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L5','text','Lesson: Error Handling

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L6','heading','Test like a user, then like a machine',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L6','text','1. Click through as a user (happy path + one mistake).
2. Add automated checks: one per feature (200 OK? correct text?).
3. Run the full suite before every deploy: `npm test`.
Green suite = permission to ship.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L6','terminal','npm test',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L6','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L7','text','Lesson: Security

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L9M2L8','text','Lesson: Performance + SaaS Launch

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L1','heading','Ideas become PRDs: problem → users → features → stack → tasks',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L1','text','One page is enough:
Problem (1 line) → Users → Must-have features (≤7) → Stack → Architecture (1 sketch) → Tasks in order → Deploy plan.
Then paste it into the Project Planner to generate todos and track them.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L1','prompt','GOAL: turn my idea into a 1-page PRD
CONTEXT: idea is [one paragraph], users are [who]
CONSTRAINTS: max 7 features, smallest stack that works
EXAMPLE: ''problem, users, features, stack, tasks''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L1','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L2','text','Lesson: Create PRD

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L3','text','Lesson: Define Features

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L4','text','Lesson: Design Architecture

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L5','text','Lesson: Choose Technologies

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M1L6','text','Lesson: Break Project into Tasks

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L1','text','Lesson: Prompt AI Coding Agents Effectively

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L2','text','Lesson: Review Generated Code

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L3','text','Lesson: Debug Independently

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L4','text','Lesson: Test Application

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L5','heading','Deploy: test → internal → production + watch',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L5','text','1. Full tests green.
2. Backup data.
3. Ship to an internal link, click everything.
4. Ship production, then watch /api/health + /api/metrics for 15 minutes.
Keep the last backup until the new version proves itself.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L5','terminal','sh deploy/backup.sh
sh deploy/healthcheck.sh',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L5','exercise','',NULL,NULL,NULL,4);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L6','text','Lesson: Maintain Application

Add content using the lesson editor.',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L7','heading','MVP: smallest thing that proves it + demo day',NULL,NULL,NULL,1);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L7','text','Cut everything except the ONE workflow that proves value.
Slice: auth → core CRUD → one AI step → test → deploy → 3-minute demo (problem, live click-through, what''s next).
Ship, watch real users, improve weekly.',NULL,NULL,NULL,2);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L7','prompt','GOAL: cut my PRD to an MVP slice
CONTEXT: my PRD is [paste]
CONSTRAINTS: 1 workflow, 2 weeks max, demoable link
EXAMPLE: ''login → main action → done, live URL''',NULL,NULL,NULL,3);
INSERT INTO lesson_blocks(lesson_id,type,body,language,url,caption,idx) VALUES ('L10M2L7','exercise','',NULL,NULL,NULL,4);
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-1','ChatGPT','AI Assistants','Conversational AI for explanations and draft prompts.','freemium','Ask anything in plain words and get explanations, examples and starter prompts.','Create a free account at chat.openai.com — runs in the browser, nothing to install.','["Open chat.openai.com and sign up with email, Google or Apple.", "Paste a lesson prompt, press Enter, read the answer fully.", "Compare the answer against the lesson objective before moving on."]','https://chat.openai.com','https://chat.openai.com','["L1M1L1", "L1M1L2", "L1M1L5"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-2','AI Coding Assistant','Coding Agents','Writes and edits code from plain-word prompts.','freemium','The core Vibe Coding engine: you describe, it writes the code, you review.','Install an AI coding extension inside VS Code, then sign in.','["Open VS Code → Extensions → install an AI coding assistant.", "Sign in and open the lesson project folder.", "Paste the lesson prompt and review every file it creates."]','https://code.visualstudio.com','https://code.visualstudio.com','["L1M2L5", "L2M1L1"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-3','VS Code','IDEs','Free code editor with AI extensions.','free','The home base where every project in this course gets built.','Download the installer from code.visualstudio.com and accept the defaults.','["Download the installer for your OS and accept the defaults.", "Open the lesson project folder (not a single file).", "Open the built-in terminal with View → Terminal."]','https://code.visualstudio.com/docs/setup','https://code.visualstudio.com','["L2M1L1", "L2M1L2"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-4','Figma','Design Tools','Free design tool for page mockups and layouts.','freemium','Sketch screens before coding so you rebuild less and finish faster.','Create a free account at figma.com — it runs in the browser.','["Sign up at figma.com on the free starter plan.", "Make a phone-size frame (375×812) and block out 3 sections.", "Share the link with your AI assistant as the design reference."]','https://help.figma.com/hc/en-us/categories/360002051613','https://figma.com','["L3M2L1"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-5','Supabase','Databases','Postgres + auth + storage with instant APIs.','freemium','The backend for multi-user and AI apps: database, logins and file storage.','Create a free project at supabase.com, then copy the URL + anon key into .env.','["Create a free project at supabase.com and wait for provisioning.", "Table Editor → New table (e.g. leads) with the lesson fields.", "Copy the Project URL + anon key into .env — never commit the service key."]','https://supabase.com/docs','https://supabase.com','["L5M1L1", "L5M2L1"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-6','n8n','Automation Platforms','Visual workflow builder: triggers → AI → actions.','freemium','Run Level 7 automations without writing servers: drag, connect, activate.','Start an n8n Cloud trial, or self-host with npm i -g n8n.','["Start n8n — the Cloud trial is fastest for beginners.", "Build Webhook trigger → AI step → send/CRM action.", "Activate, send a test event, then add the human-approval gate from L7."]','https://docs.n8n.io','https://n8n.io','["L7M1L1", "L7M2L6"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-7','Node.js','APIs','Runs JavaScript and dev servers on your machine.','free','Required to run lesson servers, tools and build scripts locally.','Install the LTS build from nodejs.org, then verify with node --version.','["Install the LTS build from nodejs.org for your OS.", "Verify: node --version and npm --version both print numbers.", "Run npm run dev in the lesson folder and open the printed URL."]','https://nodejs.org/en/download','https://nodejs.org','["L2M1L5", "L2M2L5"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-8','GitHub','Git/GitHub','Hosts code with version history.','free','Backup for every project plus the portfolio employers actually open.','Create an account at github.com, install git, set your name and email.','["Sign up at github.com and verify your email.", "Set git config user.name and user.email in the terminal.", "Push the lesson repo: init → add → commit → push (see L2M1L4)."]','https://docs.github.com/get-started','https://github.com','["L2M1L4"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-9','Git','Git/GitHub','Version control for every project.','free','Undo mistakes and track exactly what changed, file by file.','Install from git-scm.com (or Xcode tools / Git for Windows).','["Install git, then check git --version prints a number.", "Practice status → add → commit → log in a scratch folder.", "Learn undo: git restore for files, git revert for commits."]','https://git-scm.com/book/en/v2/Getting-Started-Installing-Git','https://git-scm.com','["L2M1L3"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-10','Netlify','Hosting','Free static hosting with instant deploy previews.','freemium','Publish Level 3 websites to a real link in minutes, free.','Sign up at netlify.com, then drag-and-drop the build folder.','["Build the site (npm run build) and find the output folder.", "Drag that folder onto Netlify Drop — or connect the GitHub repo.", "Copy the live URL and test it on your phone."]','https://docs.netlify.com','https://netlify.com','["L3M2L6"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-11','Expo','Deployment','Builds phone apps for iOS + Android.','free','How this course itself ships to phones: one codebase, both stores.','Install the CLI and scaffold with npx create-expo-app — see the docs.','["Install the CLI and scaffold the lesson app.", "Run npx expo start and scan the QR with Expo Go.", "Ship with EAS build → store tracks (see L10M2L5)."]','https://docs.expo.dev','https://expo.dev','["L10M2L5"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-12','Browser DevTools','Testing','Inspect and debug any web page.','free','See errors and fix layouts fast without guessing.','Built into Chrome/Safari: press F12 (Mac: Cmd+Opt+I).','["Open your page and press F12 (Mac: Cmd+Opt+I).", "Console tab: read the first red error top to bottom.", "Elements tab: click the page, tweak CSS live, copy the fix."]','https://developer.chrome.com/docs/devtools','https://developer.chrome.com/docs/devtools','["L3M2L5"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO tools(id,name,category,what,price,why,install,steps,url,website,related_lessons) VALUES ('tool-13','Terminal','Productivity','Command line to run servers and git.','free','The essential developer skill this course teaches gently, step by step.','Already built into Mac, Windows and Linux — no install needed.','["Open Terminal (Mac) or PowerShell/Terminal (Windows).", "Practice: pwd → ls → cd into the lesson folder.", "Run one safe command from the lesson, then echo hello."]','https://support.apple.com/guide/terminal/welcome/mac','https://support.apple.com/guide/terminal/welcome/mac','["L2M2L1"]' ) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO projects(id,title,level,data) VALUES ('P01','Personal Website',3,'{"id": "P01", "title": "Personal Website", "level": 3, "req": "3 pages, responsive, contact form", "arch": "Static site + components", "stack": "HTML • CSS • JS", "setup": "Install VS Code → scaffold → run dev → add assets", "stages": "Generate → Style → Navigate → Debug → Publish", "deploy": "Static hosting", "done": "Responsive + form + live URL", "order": 1, "detail": {"id": "P01", "title": "Personal Website", "level": 3, "req": "3 pages, responsive, contact form", "handholding": "Full guidance — every click shown", "requirements": ["3 pages: Home, About, Contact", "Responsive on phone + desktop widths", "Contact form validates + shows success", "Your photo, bio and contact links included"], "stack": ["HTML", "CSS", "JavaScript", "VS Code", "Netlify"], "setup": ["Install VS Code, open a folder named personal-site.", "Scaffold 3 HTML pages sharing one stylesheet + one script.", "Run a local server (npx serve .) and open the URL.", "Create assets/ with one photo + favicon."], "stages": ["Generate the 3-page skeleton with AI", "Style hero, cards and footer mobile-first", "Add navigation with active-page highlight", "Add + validate the contact form", "Debug at phone width, then publish"], "prompts": ["GOAL: 3-page personal site (Home/About/Contact). CONTEXT: vanilla HTML/CSS/JS, one stylesheet. CONSTRAINTS: mobile-first, semantic tags. EXAMPLE: header/nav/main/footer per page.", "GOAL: style system. CONTEXT: my unstyled pages. CONSTRAINTS: 2 fonts max, 3 colors. EXAMPLE: hero with headline + button.", "GOAL: contact form. CONTEXT: no backend. CONSTRAINTS: validate email + message in-browser, success note. EXAMPLE: red hints, green confirm."], "testing": ["Phone + desktop widths: no sideways scroll", "Submit form empty (errors) then valid (success)", "Every nav link lands on the right page + highlight"], "debugging": ["Blank page? DevTools Console → fix the first red error", "Broken on phone? Toggle device toolbar, fix the breakpoint"], "deployment": ["Drag the folder to Netlify Drop", "Open the live URL on your phone, keep the link"], "checklist": ["Responsive phone + desktop", "Form validates + succeeds", "Live URL posted in Showcase"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P02','Landing Page',3,'{"id": "P02", "title": "Landing Page", "level": 3, "req": "Hero, features, signup form", "arch": "Single-page marketing site", "stack": "HTML • CSS • JS", "setup": "Sketch → scaffold from sketch → dev with phone view", "stages": "Copy → Sections → Form → Polish", "deploy": "Static hosting", "done": "Clear CTA + mobile + tested signup", "order": 2, "detail": {"id": "P02", "title": "Landing Page", "level": 3, "req": "Hero, features, signup form", "handholding": "Full guidance — every click shown", "requirements": ["Hero with headline + single CTA", "Features section with 3 items", "Signup form with success state", "Mobile-first, fast load"], "stack": ["HTML", "CSS", "JavaScript", "Figma", "Netlify"], "setup": ["Sketch hero + 3 features on paper or one Figma phone frame.", "Scaffold the page from your sketch with AI.", "Serve locally, keep a phone-width window open while styling."], "stages": ["Write copy: headline, subhead, CTA text", "Build hero + features + signup sections", "Wire signup validation + success", "Polish spacing, images, speed"], "prompts": ["GOAL: landing page for [product]. CONTEXT: single file + styles. CONSTRAINTS: one CTA, mobile-first. EXAMPLE: hero, 3 features, signup, footer.", "GOAL: sharper headline. CONTEXT: current draft. CONSTRAINTS: 5 options, plain words. EXAMPLE: one promise + one button.", "GOAL: signup validation. CONTEXT: no backend. CONSTRAINTS: email check, inline errors, success without reload."], "testing": ["Empty/invalid/valid signup → correct message each time", "Phone + desktop visual pass, CTA visible without scroll", "Images sized, no layout shift on load"], "debugging": ["Weak CTA? Read headline aloud — one promise, one button", "Shift on load? Set image dimensions + preload the font"], "deployment": ["Publish via Netlify Drop or connected repo", "Share live link + headline in Community for feedback"], "checklist": ["One clear CTA above the fold", "Clean mobile layout", "Live URL + signup tested end to end"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P03','CRUD Application',4,'{"id": "P03", "title": "CRUD Application", "level": 4, "req": "Create/read/update/delete + errors", "arch": "Frontend + REST API (JSON)", "stack": "JS • Node • REST", "setup": "Define item shape → run API + client → open Network tab", "stages": "API → UI → Forms → Errors", "deploy": "Web host", "done": "All CRUD works live", "order": 3, "detail": {"id": "P03", "title": "CRUD Application", "level": 4, "req": "Create/read/update/delete + errors", "handholding": "Full guidance — every click shown", "requirements": ["Create, read, update, delete items", "Friendly error on every failure", "Data survives refresh", "Loading + empty states"], "stack": ["JavaScript", "Node.js", "REST", "JSON store", "VS Code"], "setup": ["Create crud-app, npm init -y, install minimal server deps.", "Define the item shape {id, title, done} in one shared file.", "Run API + client together, keep the Network tab open."], "stages": ["Design API: 4 routes + JSON shapes", "Build list + create UI", "Add edit + delete with confirm", "Add errors, loading + empty states"], "prompts": ["GOAL: REST API for items. CONTEXT: Node, JSON file store. CONSTRAINTS: GET/POST/PUT/DELETE, status codes. EXAMPLE: {id,title,done}.", "GOAL: CRUD UI. CONTEXT: my API above. CONSTRAINTS: confirm before delete, optimistic list. EXAMPLE: add → appears instantly.", "GOAL: resilient UI. CONTEXT: API can be down. CONSTRAINTS: friendly error card, retry button, skeleton rows."], "testing": ["Happy path: add → see → edit → delete → gone", "Stop the API: friendly error, never blank page", "Refresh mid-list: everything still there"], "debugging": ["Network tab first: method, URL, status, body — in that order", "Refresh wipes data? Save path disconnected — recheck write call"], "deployment": ["Host API + static client (one service or split)", "Smoke-test all 4 operations on the live URL"], "checklist": ["CRUD works live", "Errors friendly, never blank", "Deployed + smoke-tested URL"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P04','AI Chat Application',6,'{"id": "P04", "title": "AI Chat Application", "level": 6, "req": "Chat UI, LLM API, streaming", "arch": "Chat client → server → LLM (keys server-side)", "stack": "JS • LLM API", "setup": "Key in server .env only → scaffold chat + /api/chat → set caps", "stages": "Prompts → API → Streaming → Caps", "deploy": "Web host", "done": "Streams + handles errors + capped", "order": 4, "detail": {"id": "P04", "title": "AI Chat Application", "level": 6, "req": "Chat UI, LLM API, streaming", "handholding": "Medium guidance — checklists + hints", "requirements": ["Chat UI with history", "LLM via server route, system + user prompts", "Streaming token-by-token replies", "Usage + cost caps with fallback"], "stack": ["JavaScript", "Node.js", "LLM API", "Supabase"], "setup": ["Create LLM key, store ONLY server-side in .env.", "Scaffold chat UI + POST /api/chat forwarding to the LLM.", "Set caps: max tokens per reply + per day."], "stages": ["Write system prompt: role, rules, refusals", "Wire /api/chat with history context", "Add streaming render + typing dots", "Add caps, error fallback, cost log"], "prompts": ["GOAL: tutor system prompt. CONTEXT: beginners. CONSTRAINTS: short answers, one step at a time, refuse direct homework answers. EXAMPLE: hint, then check.", "GOAL: better replies. CONTEXT: last 6 messages. CONSTRAINTS: stay in role, cite the step. EXAMPLE: good vs rambling reply.", "GOAL: streaming + cap. CONTEXT: 200-token budget. CONSTRAINTS: render chunks, friendly “continued…” cutoff."], "testing": ["5 fixed questions → sane, on-role answers", "Remove the key: fallback message, no crash", "20-turn chat: coherent, cap enforced"], "debugging": ["Cost spike? Log prompt + tokens per reply, trim history", "Garbled output? Enforce schema + retry once"], "deployment": ["Host web + server route, env vars in host dashboard", "Watch day-one token usage against the cap"], "checklist": ["Streams smoothly", "Key-off/limit handled gracefully", "Cost cap tested + live"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P05','Business Automation',7,'{"id": "P05", "title": "Business Automation", "level": 7, "req": "Trigger, AI step, notify + approval", "arch": "Webhook → AI → CRM/email + approval gate", "stack": "Webhooks • n8n • LLM", "setup": "n8n workflow + test trigger → connect source → dry-run mode", "stages": "Trigger → AI decision → Action → Approval", "deploy": "Automation platform", "done": "Approval gate + CRM + alerts", "order": 5, "detail": {"id": "P05", "title": "Business Automation", "level": 7, "req": "Trigger, AI step, notify + approval", "handholding": "Medium guidance — checklists + hints", "requirements": ["Event trigger from a real source", "AI classify/score step", "Notify + CRM/email action", "Human approval before any send"], "stack": ["Webhooks", "n8n", "LLM API", "Supabase"], "setup": ["Create an n8n workflow with a manual test trigger.", "Connect one source: form webhook or test event sender.", "Enable dry-run: log actions instead of sending."], "stages": ["Define trigger + event shape", "Add AI classify + score", "Add notify + CRM actions", "Add approval gate, go live from dry-run"], "prompts": ["GOAL: classify lead. CONTEXT: raw message. CONSTRAINTS: intent + score 0-1 + route reply/escalate/ignore. EXAMPLE: scored sample.", "GOAL: welcome reply. CONTEXT: my voice, new lead. CONSTRAINTS: 3 sentences, opt-out line. EXAMPLE: warm + short.", "GOAL: approval summary. CONTEXT: run result. CONSTRAINTS: what, why, confidence in 4 lines."], "testing": ["Dry-run: 10 events logged, zero sent", "Approve → sent; reject → skipped + logged", "Malformed event: skipped with reason, workflow stays green"], "debugging": ["Failed run? Open run history, compare node input vs expected shape", "Misroutes? Add 2 examples to the prompt, re-run eval set"], "deployment": ["Activate n8n workflow or hosted route + scheduler", "Go-live order: dry-run clean → approval tested → failure alerts on"], "checklist": ["Approval blocks unapproved sends", "CRM updated every run", "Failure notifications wired"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P06','AI Customer Support System',7,'{"id": "P06", "title": "AI Customer Support System", "level": 7, "req": "FAQ bot, escalation, logs", "arch": "Chat → KB retriever → grounded answers → handoff", "stack": "LLM API • DB", "setup": "Write 10 FAQs → scaffold chat + /api/support → review queue", "stages": "KB → Bot → Handoff", "deploy": "Web + API", "done": "Escalates with context, never invents", "order": 6, "detail": {"id": "P06", "title": "AI Customer Support System", "level": 7, "req": "FAQ bot, escalation, logs", "handholding": "Medium guidance — checklists + hints", "requirements": ["FAQ bot grounded in your docs", "Human escalation with full context", "Conversation log + review queue", "Says “I don’t know” instead of inventing"], "stack": ["LLM API", "Supabase", "JavaScript"], "setup": ["Write 10 FAQs as plain Q/A documents (the knowledge base).", "Scaffold chat UI + /api/support with retrieval over FAQs.", "Create the review queue for flagged answers."], "stages": ["Build the 10-doc knowledge base", "Wire grounded answers (docs only)", "Add escalation with transcript", "Review weekly, grow the KB"], "prompts": ["GOAL: grounded answer. CONTEXT: retrieved docs below. CONSTRAINTS: answer ONLY from docs, else offer escalation. EXAMPLE: cited answer vs “I don’t know”.", "GOAL: handoff summary. CONTEXT: full chat. CONSTRAINTS: issue, tried steps, sentiment in 5 lines.", "GOAL: quality flag. CONTEXT: bot answer + docs. CONSTRAINTS: correct/partial/wrong + missing doc."], "testing": ["15 FAQ questions → grounded + correct; 5 off-topic → graceful “don’t know”", "Escalation always carries transcript + summary", "Spot-check 20 answers against docs, zero inventions"], "debugging": ["Wrong answer? Check WHICH doc retrieved — fix the doc first", "Hallucinations? Lower temperature, stricter “docs-only”, cite sources"], "deployment": ["Host web + API; KB editable without redeploy", "Put the weekly review on your calendar"], "checklist": ["Escalates with context", "Never invents policies", "Review queue processed weekly"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P07','AI Agent',8,'{"id": "P07", "title": "AI Agent", "level": 8, "req": "Tools, memory, verify, permissions", "arch": "Planner → allowlisted tools → verifier + memory", "stack": "LLM API • Agent runtime", "setup": "Define goal + 2 tools → allowlist → run log", "stages": "Tools → Memory → Verify → Permissions", "deploy": "Sandboxed host", "done": "Allowlist + verify + end-to-end demo", "order": 7, "detail": {"id": "P07", "title": "AI Agent", "level": 8, "req": "Tools, memory, verify, permissions", "handholding": "Low guidance — plan + review points", "requirements": ["2+ tools with strict JSON schemas", "Short-term notes + long-term facts", "Plan → act → verify loop", "Allowlist permissions + approvals"], "stack": ["LLM API", "Node.js", "Agent runtime", "Supabase"], "setup": ["Define the goal + 2 tools (search, save) with JSON schemas.", "Write the allowlist: exactly what the agent may call/send.", "Seed one run log to observe plan → act → verify."], "stages": ["Add tools with schemas + dry-run", "Add memory: notes + facts", "Add plan + verify loop", "Lock permissions, ship sandboxed"], "prompts": ["GOAL: act in small steps. CONTEXT: goal + tools. CONSTRAINTS: one call per step, verify before next. EXAMPLE: planned 5-step run.", "GOAL: verify a step. CONTEXT: step result. CONSTRAINTS: pass/fail + what is missing.", "GOAL: run summary. CONTEXT: full log. CONSTRAINTS: steps done, facts learned, approvals needed."], "testing": ["5-step research task completes with checkpoints", "Denied tool → stops + explains, never sneaks around", "Resume from checkpoint 3 after forced stop"], "debugging": ["Read the run log top-down: planner, tool args, verifier verdict", "Looping? Cap at 8 steps, require new evidence per retry"], "deployment": ["Sandboxed host, secrets server-side, approval for sends", "Keep one run log per execution for audits"], "checklist": ["Respects allowlist + approvals", "Verifies before advancing", "End-to-end task demoed"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P08','Mobile Application',9,'{"id": "P08", "title": "Mobile Application", "level": 9, "req": "Expo app, auth, push", "arch": "Expo → API → Postgres + push", "stack": "Expo • Supabase", "setup": "create-expo-app → Expo Go → Supabase .env → EAS id", "stages": "Screens → API → Auth → Store build", "deploy": "TestFlight + Play tracks", "done": "Runs on phone, auth + push tested", "order": 8, "detail": {"id": "P08", "title": "Mobile Application", "level": 9, "req": "Expo app, auth, push", "handholding": "Low guidance — plan + review points", "requirements": ["Expo app, 3+ screens", "Email auth + profiles", "Push for key events", "Runs on a real phone"], "stack": ["Expo", "Supabase", "LLM API"], "setup": ["Scaffold with create-expo-app, open in Expo Go on your phone.", "Create Supabase project, copy URL + anon key to .env.", "Configure the EAS project id for store builds."], "stages": ["Build screens with loading/empty/error", "Wire API + database with owner rules", "Add auth + profiles", "Add push + store-track build"], "prompts": ["GOAL: Expo app. CONTEXT: Home/Detail/Settings. CONSTRAINTS: loading/empty/error states each screen. EXAMPLE: list screen fetch.", "GOAL: auth + profiles. CONTEXT: Supabase. CONSTRAINTS: sign-up, verify, edit name/photo. EXAMPLE: session persist.", "GOAL: push for [event]. CONTEXT: user toggle. CONSTRAINTS: permission prompt once, deep link."], "testing": ["Real phone, slow network, airplane-mode reopen", "Sign-up → verify → profile → logout → session persists", "Push arrives with the right deep link"], "debugging": ["Weird Expo state? Re-run with --clear, read the stack top-down", "Auth fails on device? Check .env, URL allowlist, clock skew"], "deployment": ["EAS build → TestFlight internal + Play internal", "Promote to production after device smoke test"], "checklist": ["Runs from a store track", "Auth + profiles persist", "Push tested end to end"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P09','SaaS Application',9,'{"id": "P09", "title": "SaaS Application", "level": 9, "req": "Auth, AI feature, launch checklist", "arch": "Web → API → Postgres RLS → AI + jobs", "stack": "JS • Node • Postgres", "setup": "Scaffold from PRD → users+plans RLS → monitoring first", "stages": "PRD → Build → Harden → Launch", "deploy": "Prod host + CDN", "done": "Secure + monitored + demo video", "order": 9, "detail": {"id": "P09", "title": "SaaS Application", "level": 9, "req": "Auth, AI feature, launch checklist", "handholding": "Low guidance — plan + review points", "requirements": ["Auth + roles ready", "Core workflow + one AI feature", "Plans table for future billing", "Launch hardening done"], "stack": ["JavaScript", "Node.js", "Postgres", "LLM API"], "setup": ["Scaffold client, API, db from your PRD.", "Create users + plans tables with owner RLS policies.", "Add monitoring + error tracking before any users."], "stages": ["PRD → architecture → scaffold", "Core workflow + AI feature with caps", "Harden: tests, security, speed", "Launch + monitor week one"], "prompts": ["GOAL: SaaS scaffold. CONTEXT: PRD below. CONSTRAINTS: auth, db, one AI feature. EXAMPLE: route + table pairs.", "GOAL: launch hardening. CONTEXT: my repo. CONSTRAINTS: tests, RLS, rate limits, backups with commands.", "GOAL: pricing review. CONTEXT: my gate code. CONSTRAINTS: free vs pro paths, no leaks."], "testing": ["Sign-up → workflow → AI feature → billing gates", "RLS denies cross-user reads, rate limit holds", "Core routes p95 under 500ms"], "debugging": ["Reproduce from the logged route + payload, fix, add regression test", "Slow route? Log query times, add the missing index"], "deployment": ["Prod host + CDN, env vars + backups verified", "Week-one watch: errors, usage, costs daily"], "checklist": ["Secure + monitored", "Billing gates correct", "Demo video recorded"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO projects(id,title,level,data) VALUES ('P10','Student''s Own AI Product',10,'{"id": "P10", "title": "Student''s Own AI Product", "level": 10, "req": "PRD, MVP, AI, deploy, demo", "arch": "Student-designed, L9-hardened", "stack": "Student choice", "setup": "One-page PRD → MVP slice → repo + hosting", "stages": "Idea → MVP → AI → Test → Deploy → Present", "deploy": "Student launch", "done": "Live demo + docs + maintainable", "order": 10, "detail": {"id": "P10", "title": "Student''s Own AI Product", "level": 10, "req": "PRD, MVP, AI, deploy, demo", "handholding": "Independent — you plan, AI critiques", "requirements": ["One-page PRD you wrote", "MVP slice with AI step", "Deployed + demoed live", "Docs a stranger can follow"], "stack": ["Your choice", "Justify each pick", "Server-side AI keys"], "setup": ["Write the one-page PRD: user, problem, MVP slice.", "Create repo + hosting on day one.", "List the 5 riskiest unknowns in order."], "stages": ["Idea → PRD → task slice", "Build auth + core data", "Add the AI step with caps", "Test + deploy the slice", "Demo, docs, next 3 steps"], "prompts": ["GOAL: PRD critique. CONTEXT: my draft. CONSTRAINTS: cut to MVP, name the slice. EXAMPLE: tight vs bloated scope.", "GOAL: architecture. CONTEXT: my PRD. CONSTRAINTS: client/API/db/AI, justify each tech.", "GOAL: demo script. CONTEXT: my MVP. CONSTRAINTS: 3 minutes, live clicks, backup video."], "testing": ["Stranger test: can someone run it from your README?", "Happy path + one failure path on the live URL", "AI step capped, errors friendly"], "debugging": ["Stuck over an hour? Shrink the slice, log the blocker, ask with context", "Flaky demo? Record the backup video first, then go live"], "deployment": ["Your launch: live URL + repo + docs", "Present: problem, demo, what broke, what is next"], "checklist": ["Live demo + recording", "Docs + maintainable repo", "Presented to at least one human"]}}') ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, data=EXCLUDED.data;
INSERT INTO meetings(id,title,starts_at,meeting_url,description,recording_url) VALUES ('meet-weekly','Weekly Meet & Greet with the Author','2026-10-15T02:11:19.647Z','https://meet.aimasterplan.app/weekly','Weekly live with the author',NULL) ON CONFLICT (id) DO UPDATE SET starts_at=EXCLUDED.starts_at, meeting_url=EXCLUDED.meeting_url;
