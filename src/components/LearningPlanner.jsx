import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Youtube,
  FileText,
  Link2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

const resourceTypeIcons = {
  document: <FileText className="h-3.5 w-3.5" />,
  youtube: <Youtube className="h-3.5 w-3.5" />,
  notes: <BookOpen className="h-3.5 w-3.5" />,
  other: <Link2 className="h-3.5 w-3.5" />,
};

const dummyTopics = [
  {
    id: "1",
    title: "React Advanced Patterns",
    description:
      "Deep dive into advanced React patterns including compound components, render props, and hooks.",
    createdAt: "2025-01-15",
    phases: [
      {
        id: "1-1",
        title: "Compound Components",
        description: "Learn compound component pattern for flexible APIs",
        completed: true,
        resources: [
          {
            id: "r1",
            label: "Kent C. Dodds Blog",
            url: "https://kentcdodds.com",
            type: "document",
          },
          {
            id: "r2",
            label: "YouTube Tutorial",
            url: "https://youtube.com",
            type: "youtube",
          },
        ],
      },
      {
        id: "1-2",
        title: "Custom Hooks",
        description: "Build reusable logic with custom hooks",
        completed: true,
        resources: [
          { id: "r3", label: "React Docs", url: "https://react.dev", type: "document" },
        ],
      },
      {
        id: "1-3",
        title: "Render Props & HOCs",
        description: "Understand render props and higher-order components",
        completed: false,
        resources: [],
      },
      {
        id: "1-4",
        title: "Performance Optimization",
        description: "useMemo, useCallback, React.memo patterns",
        completed: false,
        resources: [
          {
            id: "r4",
            label: "Performance Guide",
            url: "https://react.dev",
            type: "notes",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "System Design",
    description: "Learn system design fundamentals for scalable applications.",
    createdAt: "2025-02-01",
    phases: [
      {
        id: "2-1",
        title: "Fundamentals",
        description: "CAP theorem, load balancing, caching",
        completed: true,
        resources: [
          {
            id: "r5",
            label: "System Design Primer",
            url: "https://github.com",
            type: "document",
          },
        ],
      },
      {
        id: "2-2",
        title: "Database Design",
        description: "SQL vs NoSQL, sharding, replication",
        completed: false,
        resources: [
          {
            id: "r6",
            label: "DB Design Video",
            url: "https://youtube.com",
            type: "youtube",
          },
        ],
      },
      {
        id: "2-3",
        title: "Microservices",
        description: "Service decomposition and communication patterns",
        completed: false,
        resources: [],
      },
    ],
  },
];

const LearningPlanner = ({ isEditMode }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [topics, setTopics] = useState(dummyTopics);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingPhase, setEditingPhase] = useState({ topicId: "", phase: null });

  // Topic form
  const [topicForm, setTopicForm] = useState({ title: "", description: "" });
  // Phase form
  const [phaseForm, setPhaseForm] = useState({ title: "", description: "" });
  const [phaseResources, setPhaseResources] = useState([]);

  const getProgress = (topic) => {
    if (topic.phases.length === 0) return 0;
    const completed = topic.phases.filter((p) => p.completed).length;
    return Math.round((completed / topic.phases.length) * 100);
  };

  const togglePhaseComplete = (topicId, phaseId) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              phases: t.phases.map((p) =>
                p.id === phaseId ? { ...p, completed: !p.completed } : p
              ),
            }
          : t
      )
    );
  };

  const openAddTopic = () => {
    setEditingTopic(null);
    setTopicForm({ title: "", description: "" });
    setIsTopicModalOpen(true);
  };

  const openEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicForm({ title: topic.title, description: topic.description });
    setIsTopicModalOpen(true);
  };

  const saveTopic = () => {
    if (!topicForm.title.trim()) return;
    if (editingTopic) {
      setTopics((prev) =>
        prev.map((t) =>
          t.id === editingTopic.id
            ? { ...t, title: topicForm.title, description: topicForm.description }
            : t
        )
      );
    } else {
      const newTopic = {
        id: Date.now().toString(),
        title: topicForm.title,
        description: topicForm.description,
        phases: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTopics((prev) => [...prev, newTopic]);
    }
    setIsTopicModalOpen(false);
  };

  const deleteTopic = (id) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const openAddPhase = (topicId) => {
    setEditingPhase({ topicId, phase: null });
    setPhaseForm({ title: "", description: "" });
    setPhaseResources([]);
    setIsPhaseModalOpen(true);
  };

  const openEditPhase = (topicId, phase) => {
    setEditingPhase({ topicId, phase });
    setPhaseForm({ title: phase.title, description: phase.description });
    setPhaseResources([...phase.resources]);
    setIsPhaseModalOpen(true);
  };

  const savePhase = () => {
    if (!phaseForm.title.trim()) return;
    const { topicId, phase } = editingPhase;
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        if (phase) {
          return {
            ...t,
            phases: t.phases.map((p) =>
              p.id === phase.id
                ? {
                    ...p,
                    title: phaseForm.title,
                    description: phaseForm.description,
                    resources: phaseResources,
                  }
                : p
            ),
          };
        }
        return {
          ...t,
          phases: [
            ...t.phases,
            {
              id: Date.now().toString(),
              title: phaseForm.title,
              description: phaseForm.description,
              completed: false,
              resources: phaseResources,
            },
          ],
        };
      })
    );
    setIsPhaseModalOpen(false);
  };

  const deletePhase = (topicId, phaseId) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? { ...t, phases: t.phases.filter((p) => p.id !== phaseId) }
          : t
      )
    );
  };

  const addResource = () => {
    setPhaseResources((prev) => [
      ...prev,
      { id: Date.now().toString(), label: "", url: "", type: "other" },
    ]);
  };

  const removeResource = (id) => {
    setPhaseResources((prev) => prev.filter((r) => r.id !== id));
  };

  const updateResource = (id, field, value) => {
    setPhaseResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <section id="learning" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Learning <span className="gradient-text">Planner</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your learning journey with topics, phases, and progress milestones.
          </p>
          {isEditMode && (
            <Button onClick={openAddTopic} className="mt-6 gap-2">
              <Plus className="h-4 w-4" /> Add Topic
            </Button>
          )}
        </motion.div>

        <div className="space-y-6">
          {topics.map((topic, i) => {
            const progress = getProgress(topic);
            const isExpanded = expandedTopic === topic.id;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="glass-card overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader
                    className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <BookOpen className="h-5 w-5 text-primary shrink-0" />
                          <CardTitle className="text-xl">{topic.title}</CardTitle>
                          <Badge
                            variant={progress === 100 ? "default" : "secondary"}
                            className="shrink-0"
                          >
                            {progress}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {topic.description}
                        </p>
                        <div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-2">
                            {topic.phases.filter((p) => p.completed).length} / {topic.phases.length}{" "}
                            phases completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isEditMode && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditTopic(topic);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTopic(topic.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          {/* Timeline */}
                          <div className="relative ml-4 border-l-2 border-border pl-6 space-y-6">
                            {topic.phases.map((phase, pi) => (
                              <motion.div
                                key={phase.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: pi * 0.05 }}
                                className="relative"
                              >
                                {/* Timeline dot */}
                                <div
                                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    phase.completed
                                      ? "bg-primary border-primary"
                                      : "bg-background border-muted-foreground"
                                  }`}
                                >
                                  {phase.completed && (
                                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>

                                <div
                                  className={`p-4 rounded-lg border transition-colors ${
                                    phase.completed
                                      ? "bg-primary/5 border-primary/20"
                                      : "bg-card border-border"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3 flex-1">
                                      <button
                                        onClick={() =>
                                          togglePhaseComplete(topic.id, phase.id)
                                        }
                                        className="mt-0.5 shrink-0 hover:opacity-80 transition-opacity"
                                      >
                                        {phase.completed ? (
                                          <CheckCircle2 className="h-5 w-5 text-primary" />
                                        ) : (
                                          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                        )}
                                      </button>
                                      <div className="flex-1 min-w-0">
                                        <h4
                                          className={`font-semibold ${
                                            phase.completed
                                              ? "line-through text-muted-foreground"
                                              : ""
                                          }`}
                                        >
                                          {phase.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {phase.description}
                                        </p>

                                        {/* Resources */}
                                        {phase.resources.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-3">
                                            {phase.resources.map((res) => (
                                              <a
                                                key={res.id}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors group"
                                              >
                                                <span className="group-hover:scale-110 transition-transform">
                                                  {resourceTypeIcons[res.type]}
                                                </span>
                                                {res.label}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {isEditMode && (
                                      <div className="flex gap-1 shrink-0">
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7"
                                          onClick={() => openEditPhase(topic.id, phase)}
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7"
                                          onClick={() => deletePhase(topic.id, phase.id)}
                                        >
                                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {isEditMode && (
                            <Button
                              variant="outline"
                              className="mt-4 ml-10 gap-2"
                              onClick={() => openAddPhase(topic.id)}
                            >
                              <Plus className="h-4 w-4" /> Add Phase
                            </Button>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}

          {topics.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-center py-12"
            >
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                No learning topics yet.{" "}
                {isEditMode && "Click 'Add Topic' to get started!"}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Topic Modal */}
      <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "Edit Topic" : "Add New Topic"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input
                value={topicForm.title}
                onChange={(e) =>
                  setTopicForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. React Advanced Patterns"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description
              </label>
              <Textarea
                value={topicForm.description}
                onChange={(e) =>
                  setTopicForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description of what you'll learn"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsTopicModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTopic}>
              {editingTopic ? "Save Changes" : "Add Topic"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phase Modal */}
      <Dialog open={isPhaseModalOpen} onOpenChange={setIsPhaseModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPhase.phase ? "Edit Phase" : "Add New Phase"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Phase Title
              </label>
              <Input
                value={phaseForm.title}
                onChange={(e) =>
                  setPhaseForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Fundamentals"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description
              </label>
              <Textarea
                value={phaseForm.description}
                onChange={(e) =>
                  setPhaseForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                placeholder="What this phase covers"
                rows={3}
              />
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Resources</label>
                <Button variant="outline" size="sm" onClick={addResource} className="gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add Link
                </Button>
              </div>
              <div className="space-y-3">
                {phaseResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex gap-2 items-start p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        value={res.label}
                        onChange={(e) =>
                          updateResource(res.id, "label", e.target.value)
                        }
                        placeholder="Link label (e.g. React Docs)"
                        className="h-8 text-sm"
                      />
                      <Input
                        value={res.url}
                        onChange={(e) =>
                          updateResource(res.id, "url", e.target.value)
                        }
                        placeholder="URL"
                        className="h-8 text-sm"
                      />
                      <select
                        value={res.type}
                        onChange={(e) =>
                          updateResource(res.id, "type", e.target.value)
                        }
                        className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
                      >
                        <option value="document">📄 Document</option>
                        <option value="youtube">▶️ YouTube</option>
                        <option value="notes">📝 Notes</option>
                        <option value="other">🔗 Other</option>
                      </select>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0"
                      onClick={() => removeResource(res.id)}
                    >
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPhaseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePhase}>
              {editingPhase.phase ? "Save Changes" : "Add Phase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LearningPlanner;
