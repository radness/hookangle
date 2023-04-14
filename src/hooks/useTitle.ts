import { useDocumentTitle } from 'usehooks-ts';

const useTitle = (title: string) => {
  useDocumentTitle(`${title} - Viewtrap`);
};

export default useTitle;
