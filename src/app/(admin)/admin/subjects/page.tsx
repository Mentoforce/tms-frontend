"use client";

import { useEffect, useState } from "react";
import SubjectList from "@/components/admin/subjects/SubjectList";
import api from "@/lib/axios";

export default function SupportTopicPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    setLoading(true);
    const res = await api.get("/subjects/admin");
    setData(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) return null;

  return (
    <SubjectList
      subjects={data.subjects}
      stats={{
        main: data.totalSubjects,
        active: data.activeSubjects,
        sub: data.totalSubSubjects,
      }}
      onRefresh={fetchSubjects}
    />
  );
}
