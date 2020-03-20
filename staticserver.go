package main

import (
	"net/http"

	"strings"

	"github.com/julienschmidt/httprouter"
)

func main() {
	static := httprouter.New()
	static.ServeFiles("/static/*filepath", neuteredFileSystem{http.Dir("./static")})
	http.ListenAndServe(":1234", static)
}

type neuteredFileSystem struct {
	fs http.FileSystem
}

func (nfs neuteredFileSystem) Open(path string) (http.File, error) {

	f, err := nfs.fs.Open(path)
	if err != nil {
		return nil, err
	}

	s, err := f.Stat()
	if s.IsDir() {
		index := strings.TrimSuffix(path, "/") + "/index.html"
		if _, err := nfs.fs.Open(index); err != nil {
			return nil, err
		}
	}

	return f, nil
}
