import * as React from 'react';
import { getModelServingProjectsAvailable } from '~/api';
import { ProjectKind } from '~/k8sTypes';

const useModelServingProjects = (): [
  projects: ProjectKind[],
  loaded: boolean,
  loadError: Error | undefined,
  fetchProjects: () => Promise<void>,
] => {
  const [projects, setProjects] = React.useState<ProjectKind[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [loadError, setLoadError] = React.useState<Error | undefined>(undefined);

  const fetchProjects = React.useCallback(
    () =>
      getModelServingProjectsAvailable()
        .then((newProjects) => {
          setProjects(newProjects.filter(({ status }) => status?.phase === 'Active'));
        })
        .catch((e) => {
          setLoadError(e);
        }),
    [],
  );

  React.useEffect(() => {
    if (!loaded) {
      fetchProjects().then(() => {
        setLoaded(true);
      });
    }
    // TODO: No cleanup -- custom hook to manage that??
  }, [loaded, fetchProjects]);

  return [projects, loaded, loadError, fetchProjects];
};

export default useModelServingProjects;
