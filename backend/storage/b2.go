package storage

import (
	"fmt"
	"io"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/google/uuid"
)

type Storage struct {
	uploader     *s3manager.Uploader
	deleter      *s3.S3
	bucket       string
	publicBaseURL string
}

func New(endpoint, keyID, applicationKey, bucketName, publicBaseURL string) (*Storage, error) {
	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String("us-east-1"), // B2 requires a region, any value works
		Endpoint:         aws.String(endpoint),
		Credentials:      credentials.NewStaticCredentials(keyID, applicationKey, ""),
		S3ForcePathStyle: aws.Bool(true),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create storage session: %w", err)
	}

	return &Storage{
		uploader:      s3manager.NewUploader(sess),
		deleter:       s3.New(sess),
		bucket:        bucketName,
		publicBaseURL: publicBaseURL,
	}, nil
}

// UploadFile uploads an image to Backblaze B2 and returns the public URL.
// contentType should be the MIME type e.g. "image/jpeg"
// originalFilename is used to preserve the file extension
func (s *Storage) UploadFile(originalFilename, contentType string, data io.Reader) (string, error) {
	ext := filepath.Ext(originalFilename)
	if ext == "" {
		ext = extensionFromMIME(contentType)
	}
	key := "photos/" + uuid.New().String() + ext

	_, err := s.uploader.Upload(&s3manager.UploadInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        data,
		ContentType: aws.String(contentType),
		ACL:         aws.String("public-read"),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file: %w", err)
	}

	publicURL := strings.TrimRight(s.publicBaseURL, "/") + "/" + key
	return publicURL, nil
}

// DeleteFile removes a file from storage given its full public URL.
func (s *Storage) DeleteFile(publicURL string) error {
	base := strings.TrimRight(s.publicBaseURL, "/") + "/"
	key := strings.TrimPrefix(publicURL, base)
	if key == publicURL {
		// URL didn't match our base — skip deletion silently
		return nil
	}

	_, err := s.deleter.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	return err
}

func extensionFromMIME(mime string) string {
	switch mime {
	case "image/jpeg":
		return ".jpg"
	case "image/png":
		return ".png"
	case "image/webp":
		return ".webp"
	case "image/gif":
		return ".gif"
	default:
		return ".jpg"
	}
}
