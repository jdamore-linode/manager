import 'cypress-file-upload';
import { objectStorageBucketFactory } from 'src/factories/objectStorage';
import {
  interceptBucketCreate,
  interceptBucketDelete,
  interceptBucketObjectDelete,
  interceptBucketObjectList,
  interceptBucketObjectS3Delete,
  interceptBucketObjectS3Upload,
  interceptBucketObjectUpload,
  interceptBuckets,
} from 'support/intercepts/object-storage';
import { randomLabel } from 'support/util/random';

/**
 * @file Smoke tests for Cloud Manager object storage.
 */
describe('object storage smoke tests', () => {
  /*
   * - Tests core object storage bucket create flow using mocked API responses.
   * - Creates bucket.
   * - Confirms bucket is listed in table.
   */
  it('can create object storage bucket - smoke test', () => {
    const bucketLabel = randomLabel();
    const bucketRegion = 'Atlanta, GA';
    const bucketCluster = 'us-southeast-1';
    const bucketHostname = `${bucketLabel}.${bucketCluster}.linodeobjects.com`;

    interceptBuckets([]).as('getBuckets');
    interceptBucketCreate(bucketLabel, bucketCluster).as('createBucket');

    cy.visitWithLogin('/object-storage');
    cy.wait('@getBuckets');
    cy.get('[data-qa-entity-header="true"]').within(() => {
      cy.findByText('Create Bucket').should('be.visible').click();
    });
    cy.get('[data-qa-drawer="true"]')
      .should('be.visible')
      .within(() => {
        cy.findByText('Label').click().type(bucketLabel);
        cy.findByText('Region').click().type(`${bucketRegion}{enter}`);
        cy.get('[data-qa-buttons]').within(() => {
          cy.findByText('Create Bucket').should('be.visible').click();
        });
      });
    cy.wait('@createBucket');
    cy.findByText(bucketLabel).should('be.visible');
    cy.findByText(bucketRegion).should('be.visible');
    cy.findByText(bucketHostname).should('be.visible');
  });

  /*
   * - Tests core object storage upload and delete flows using mocked API responses.
   * - Uploads files in `object-storage-files` fixtures directory.
   * - Confirms uploaded files are shown in object list.
   * - Deletes uploaded files.
   * - Confirms deleted files are removed from object list.
   */
  it('can upload, view, and delete bucket objects - smoke test', () => {
    const bucketLabel = randomLabel();
    const bucketCluster = 'us-southeast-1';
    const bucketContents = [
      'object-storage-files/1.txt',
      'object-storage-files/2.jpg',
      'object-storage-files/3.jpg',
      'object-storage-files/4.zip',
    ];

    interceptBucketObjectList(bucketLabel, bucketCluster, []).as(
      'getBucketObjects'
    );

    cy.visitWithLogin(
      `/object-storage/buckets/${bucketCluster}/${bucketLabel}`
    );
    cy.wait('@getBucketObjects');

    cy.log('Upload bucket objects');
    bucketContents.forEach((bucketFile) => {
      const filename = bucketFile.split('/')[1];

      interceptBucketObjectUpload(bucketLabel, bucketCluster, filename).as(
        'uploadBucketObject'
      );
      interceptBucketObjectS3Upload(bucketLabel, bucketCluster, filename).as(
        'uploadBucketObjectS3'
      );

      cy.fixture(bucketFile, null).then((bucketFileContents) => {
        cy.get('[data-qa-drop-zone="true"]').attachFile(
          {
            fileContent: bucketFileContents,
            fileName: filename,
          },
          {
            subjectType: 'drag-n-drop',
          }
        );
      });

      cy.wait(['@uploadBucketObject', '@uploadBucketObjectS3']);
    });

    cy.log('Check and delete bucket objects');
    bucketContents.forEach((bucketFile) => {
      const filename = bucketFile.split('/')[1];

      interceptBucketObjectDelete(bucketLabel, bucketCluster, filename).as(
        'deleteBucketObject'
      );
      interceptBucketObjectS3Delete(bucketLabel, bucketCluster, filename).as(
        'deleteBucketObjectS3'
      );

      cy.findByLabelText('List of Bucket Objects').within(() => {
        cy.findByText(filename)
          .should('be.visible')
          .closest('tr')
          .within(() => {
            cy.findByText('Delete').click();
          });
      });

      cy.findByText(`Delete ${filename}`).should('be.visible');
      cy.get('[data-qa-buttons="true"]').within(() => {
        cy.findByText('Delete').click();
      });

      cy.wait(['@deleteBucketObject', '@deleteBucketObjectS3']);
    });

    cy.findByText('This bucket is empty.').should('be.visible');
  });

  /*
   * - Tests core object storage bucket deletion flow using mocked API responses.
   * - Mocks existing buckets.
   * - Deletes mocked bucket, confirms that landing page reflects deletion.
   */
  it('can delete object storage bucket - smoke test', () => {
    const bucketLabel = randomLabel();
    const bucketCluster = 'us-southeast-1';
    const bucketMock = objectStorageBucketFactory.build({
      label: bucketLabel,
      cluster: bucketCluster,
      hostname: `${bucketLabel}.${bucketCluster}.linodeobjects.com`,
      objects: 0,
    });

    interceptBuckets(bucketMock).as('getBuckets');
    interceptBucketDelete(bucketLabel, bucketCluster).as('deleteBucket');

    cy.visitWithLogin('/object-storage');
    cy.wait('@getBuckets');

    cy.findByText(bucketLabel)
      .should('be.visible')
      .closest('tr')
      .within(() => {
        cy.findByText('Delete').should('be.visible').click();
      });

    cy.findByText(`Delete Bucket ${bucketLabel}`).should('be.visible');
    cy.findByLabelText('Bucket Name').click().type(bucketLabel);
    cy.get('[data-qa-buttons="true"]').within(() => {
      cy.findByText('Delete Bucket')
        .closest('button')
        .should('be.enabled')
        .should('be.visible')
        .click();
    });

    cy.wait('@deleteBucket');
    cy.findByText('Need help getting started?').should('be.visible');
  });
});
